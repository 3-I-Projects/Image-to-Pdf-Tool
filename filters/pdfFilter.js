const { consumeFromQueue, sendToQueue } = require('../utils/connection');
const { createPDF } = require('../utils/pdf');

async function pdfFilter() {
    consumeFromQueue('pdfQueue', async (translatedData) => {
        const pdfFile = await createPDF(translatedData);
        const data = { id: translatedData.id, path: pdfFile };
        console.log('pdf created at ' + data.path);
        sendToQueue('finishedPdfQueue', data);
    })
}

pdfFilter();