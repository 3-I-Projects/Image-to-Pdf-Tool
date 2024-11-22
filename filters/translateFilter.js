const { text } = require('pdfkit');
const { sendToQueue, consumeFromQueue, connectToChannel } = require('../utils/connection');
const { translate } = require('../utils/translate');

/**
 * Filter to process text and translate it
 */
async function translateFilter() {
    // take a message out of the translate queue to process it
    consumeFromQueue('translateQueue', async (data) => {
        try {
            // console.log('text from translateQueue' + text);
            
            // const startTime = Date.now();
            const translatedText = await translate(data.text);
            // const endTime = Date.now();
            // console.log(`Elapsed time for translate: ${endTime - startTime} ms`);
            
            // wrap the translated text with the id to send to the next queue
            const translatedData = { id: data.id, text: translatedText }
            
            // console.log('translated text:', translatedData.text.trim());
            sendToQueue('pdfQueue', translatedData);
        } catch (error) {
            console.error(error);
        }
    });
    setTimeout(() => connectToChannel('pdfQueue'), 100);
}

translateFilter();