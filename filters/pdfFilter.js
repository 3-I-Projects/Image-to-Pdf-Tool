const { consumeFromQueue, sendToQueue } = require('../utils/connection');
const { createPDF } = require('../utils/pdf');

/**
 * Filter to process text and create PDF files
 */
async function pdfFilter() {
    consumeFromQueue('pdfQueue', async (translatedData) => {
        const pdfFile = await createPDF(translatedData);

        // wrap the pdf file path with the id to send to the next queue
        const data = { id: translatedData.id, path: pdfFile };
        console.log('pdf created at ' + data.path);

        // this queue is the last queue, will be consumed in index.js to render the file for user to download
        sendToQueue('finishedPdfQueue', data);
    })
}

pdfFilter();