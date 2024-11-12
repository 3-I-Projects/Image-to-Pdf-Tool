// // old code
// const ocr = require("./utils/ocr");
// const { createPDF } = require("./utils/pdf");
// const { translate } = require("./utils/translate");

// (async () => {
//     try {
//         const text = await ocr.image2text("./data/sample.png");
//         console.log(text);
//         const viText = await translate(text);
//         console.log(viText);
//         const pdfFile = createPDF(viText);
//         console.log("This is PDF file: " + pdfFile)
//     } catch (e) {
//         console.log(e);
//     }
// })();

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid4 = require('uuid4');
const { sendToQueue, consumeFromQueue } = require('./utils/connection');

const app = express();
const upload = multer({ dest: 'uploads/' });

// To render .ejs files
app.set('view engine', 'ejs');

// Root directory
app.get('/', (req, res) => {
    res.send('<p> Please go to <a href="/upload">Upload page</a></p>')
});

datas = {};

// Upload directory
app
    // Route the application to /upload
    .route('/upload')
    .get((req, res) => {
        res.render('file_upload');
    })
    // Listen for post request from client
    .post(upload.array('file'), (req, res) => {
        const files = req.files;
        
        // console.log('id: ' + id);
        files.forEach(file => {
            const id = uuid4();
            
            // Dynamically rename the file with the extension taken from mimetype
            const newFileName = file.filename + '.' + file.mimetype.split('/')[1];
            
            // Create new path for the new file
            const newPath = path.join(__dirname, 'uploads', newFileName);
            
            const data = { id: id, path: newPath, originalname: file.originalname, status: 'pending' };
            datas[data.id] = data;
            console.log('datas is ');
            console.log(datas);
            console.log('data with id : ' + data.id + ' is ' + data.status);
            
            // Send the new file to the queue
            sendToQueue('ocrQueue', data);
            
            // Sync the new file with the old file using the `fs` module
            fs.renameSync(file.path, newPath);
            res.render('finished')
        })
    });
    
consumeFromQueue('finishedPdfQueue', (pdfFile) => {
    console.log('pdffile = ', pdfFile);
    if (pdfFile) {
        datas[pdfFile.id].status = 'finished';
    }
});
    
app.get('/upload/:id', (req, res) => {
    const id = req.params.id;
    const data = datas[id];
    const status = data.status;
    console.log('id is :' + id);
    console.log(status);
});

app.listen(3000, () => console.log('Server started on port 3000'));