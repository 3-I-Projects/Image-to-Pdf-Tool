const { sendToQueue, consumeFromQueue } = require('../utils/connection');
const { image2text } = require('../utils/ocr');

/**
 * Filter to process images and convert them to text
 */
async function ocrFilter() {
    // take a message out of the ocr queue to process it 
    consumeFromQueue('ocrQueue', async (image) => {

        const startTime = Date.now();        
        // send the image information to image2text to recognize characters, await for return to move on
        const text = await image2text(image.path);
        const endTime = Date.now();

        console.log(`Elapsed time of ocr: ${endTime - startTime} ms`);

        // define a new type of data (only necessary information is kept)
        const data = { id: image.id, text: text };

        // console.log('text to be processed:', text.trim());

        // send the data to the next queue to process
        await sendToQueue('translateQueue', data);
    })
}

ocrFilter();