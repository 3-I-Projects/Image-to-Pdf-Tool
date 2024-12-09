const { consumeFromQueue, sendToQueue, connectToChannel } = require('../utils/connection');
const { createPDF, encodePDF } = require('../utils/pdf');

/**
 * Filter to process text and create PDF files
 */
async function pdfFilter() {
    consumeFromQueue('pdfQueue', async (translatedData) => {
        try {

            // const startTime = Date.now();
            const pdfFile = encodePDF(translatedData);
            // const endTime = Date.now();
            
            // wrap the pdf file path with the id to send to the next queue
            const data = { id: translatedData.id, encodedPDF: pdfFile };
            // console.log(`Elapsed time of pdf: ${endTime - startTime} ms`);
            
            // console.log('pdf created at', data.path.trim());
            
            // this queue is the last queue, will be consumed in index.js to render the file for user to download
            sendToQueue('finishedPdfQueue', data);
        } catch (error) {
            console.error(error);
        }
    });
    setTimeout(() => connectToChannel('finishedPdfQueue'), 100);
}

pdfFilter();