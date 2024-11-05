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

const app = express();
const upload = multer({ dest: 'uploads/' });

// To render .ejs files
app.set('view engine', 'ejs');

// Root directory
app.get('/', (req, res) => {
    res.render('index');
})

// Upload directory
app
    // Route the application to /upload
    .route('/upload')
    .get((req, res) => {
        res.render('file_upload');
    })
    // Listen for post request from client
    .post(upload.single('file'), (req, res) => {
        const file = req.file;

        // Dynamically rename the file with the extension taken from mimetype
        const newFileName = file.filename + '.' + file.mimetype.split('/')[1];
        
        // Create new path for the new file
        const newPath = path.join(__dirname, 'uploads', newFileName);

        // Sync the new file with the old file using the `fs` module
        fs.renameSync(file.path, newPath);
        res.send('Uploaded');
    });

app.listen(3000);