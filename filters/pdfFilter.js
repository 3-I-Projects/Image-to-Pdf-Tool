const { consumeFromQueue, sendToQueue } = require('../utils/connection');
const { createPDF } = require('../utils/pdf');

async function pdfFilter() {
    consumeFromQueue('pdfQueue', async (text) => {
        const pdfFile = await createPDF(text);
        console.log('pdf created at ' + pdfFile);
        sendToQueue('finishedPdfQueue', pdfFile);
    })
}

pdfFilter();