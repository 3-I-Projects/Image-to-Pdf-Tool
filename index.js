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
const { Worker } = require('worker_threads');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use('/upload', express.static('./views/file_upload.html'));
app.use('/finished', express.static('./views/finished.html'));

// Root directory
app.get('/', (req, res) => {
    res.send('<p> Please go to <a href="/upload">Upload page</a></p>')
});

// Upload directory 
app.get('/upload', (req, res) => {
    res.render('file_upload');
});

// Listen for post request from client
app.post('/upload', upload.array('image-upload'), (req, res) => {    
    const files = req.files;

    files.map((file) => {
        const id = uuid4();
        const newFileName = file.filename + '.' + file.mimetype.split('/')[1];
        const newPath = path.join(__dirname, 'uploads', newFileName);

        fs.renameSync(file.path, newPath);

        const data = { id, path: newPath, originalname: file.originalname };
        sendToQueue('ocrQueue', data);
    })
    res.redirect('/finished');

    // consumeFromQueue('finishedPdfQueue', (pdfFile) => {
    //     console.log('pdf file isd: ' + pdfFile);
    //     res.download(pdfFile);
    // })
});

app.listen(3000);