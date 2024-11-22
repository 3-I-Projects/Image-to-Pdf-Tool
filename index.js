const ocr = require("./utils/ocr");
const { createPDF } = require("./utils/pdf");
const { translate } = require("./utils/translate");

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid4 = require('uuid4');
const { sendToQueue, consumeFromQueue, connectToChannel } = require('./utils/connection');

const app = express();
const upload = multer({ dest: 'uploads/' });

// to render ejs files in /views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/upload', express.static('./views/file_upload.html'));
app.use('/old/upload', express.static('./views/old_file_upload.html'));

// Root directory
app.get('/', (req, res) => {
    res.send('<p> Please go to <a href="/upload">Upload page</a></p>')
});

// variable to store all the files with additional information, used to process the file through pipes and filters
var datas = {};

// listen for post request from client
app.post('/upload', upload.array('image-upload'), (req, res) => {
    // get all files uploaded from the request 
    const files = req.files;

    const startTime = Date.now();
    // variable to store all the file ids, used to render the file name in done.ejs so that user can download the file
    var fileIds = {};
    files.map((file) => {
        // generate a unique id, this id will be attached to the file to identified the file
        const id = uuid4();

        // change file name to id.extension in which extension is its mimetype
        const newFileName = id + '.' + file.mimetype.split('/')[1];

        // new path to store the file after its name is changed
        const newPath = path.join(__dirname, 'uploads', newFileName);

        const data = { id: id, path: newPath, originalname: file.originalname, status: 'pending...', processingTime: Date.now() };

        // add the file data to fileIds and datas
        fileIds[data.id] = data;
        datas[data.id] = data;

        // console.log('datas is', datas);
        sendToQueue('ocrQueue', data);
        
        // sync the old file with its new path to change its name
        fs.renameSync(file.path, newPath);
    })
    const endTime = Date.now();
    console.log(`Elapsed time for parsing files: ${endTime - startTime} ms`);


    // render the done.ejs file with parameter are all the file ids
    res.render('done', { fileIds });
});

// fix bug where the server would open many connection at once resulting in multiple channels when only 1 is needed
setTimeout(() => connectToChannel('ocrQueue'), 100);
// function to take out a message from a queue to process it
consumeFromQueue('finishedPdfQueue', (pdfFile) => {
    // check if there is a pdf file after processed 
    if (pdfFile) {
        if (datas[pdfFile.id] !== undefined) {
            // set the status of the file to finished so the user can install it
            datas[pdfFile.id].status = 'finished';
                
            // set the file's path to its new path from output folder
            datas[pdfFile.id].path = pdfFile.path;

            datas[pdfFile.id].processingTime = Date.now() - datas[pdfFile.id].processingTime;
            console.log(`Finished processing ${pdfFile.id} in ${datas[pdfFile.id].processingTime}ms`);

            if (Object.values(datas).every(data => data.status === 'finished')) {
                const average = Object.values(datas).reduce((acc, data) => acc + data.processingTime, 0) / Object.values(datas).length;
                console.log(`Average processing time: ${average/1000}s`);
            }
        }
        
    }
});
    
app.get('/upload/:id', (req, res) => {
    // get the id parameter from the request url
    const id = req.params.id;

    // get the file data identified by its id
    const data = datas[id];

    // save file's status in a variable
    const status = data.status;

    if (status == 'finished')
        // transfer the file with its path from the output folder and name is its original name when the user uploaded it
        res.download(data.path, data.originalname.split('.')[0] + '.pdf');
    else
        // handle the case when file is not ready but user still clicks the download link 
        res.send('File is not ready');
});

app.use(express.json());
app.post('/upload/statuses', (req, res) => {
    const { ids } = req.body;
    const statuses = ids.map(id => ({
        id,
        status: datas[id].status
    }));
    res.json(statuses);
});

// endpoint to get status of a file 
app.get('/upload/:id/status', (req, res) => {
    // get id of a file
    const id = req.params.id;

    // get the data of the file identified by its id
    const data = datas[id];
    res.send(data);
});

app.post('/old/upload', upload.array('image-upload'), (req, res) => {
    const files = req.files;
    
    var fileIds = {};
    files.map((file) => {
        const id = uuid4();
        const newFileName = id + '.' + file.mimetype.split('/')[1];
        const newPath = path.join(__dirname, 'uploads', newFileName);
        const data = { id: id, path: newPath, originalname: file.originalname, status: 'pending...' };

        fileIds[data.id] = data;
        datas[data.id] = data;

        (async (imageId) => {
            try {
                const text = await ocr.image2text(`./uploads/${imageId}.png`);
                const viText = await translate(text);
                const pdfFile = createPDF({ id: imageId, text: viText });
                datas[data.id].status = 'finished';
                datas[data.id].path = pdfFile;
            } catch (e) {
                console.log(e);
            }
        })(id);
        
        fs.renameSync(file.path, newPath);
    })

    res.render('done', { fileIds });
});

app.listen(3000, () => console.log('Server started on port 3000'));