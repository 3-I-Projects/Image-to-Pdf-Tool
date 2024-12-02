const PDFDocument = require('pdfkit');
const fs = require('fs');


function createPDF(translatedData) {
    const OUT_FILE = `./output/${translatedData.id}.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(OUT_FILE));
    doc.font('font/Roboto-Regular.ttf')
        .fontSize(14)
        .text(translatedData.text, 100, 100);
    doc.end();
    return OUT_FILE;
}

function encodePDF(translatedData) {
    const doc = new PDFDocument();
    doc.text(translatedData.text, 100, 100)
        .font('font/Roboto-Regular.ttf')
        .fontSize(14)
    doc.end();
    const data = doc.read();
    // console.log('data is', data.toString('base64'));
    return data.toString('base64');
}


module.exports = {
    createPDF, encodePDF
}