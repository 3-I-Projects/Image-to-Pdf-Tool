const fs = require('fs');
const { sendToQueue, consumeFromQueue } = require('../utils/connection');
const { image2text } = require('../utils/ocr');

async function ocrFilter() {
    consumeFromQueue('ocrQueue', async (imagePath) => {
        // console.log('image is' + image.data);
        const text = await image2text(imagePath);
        console.log('text to be processed: ' + text);
        await sendToQueue('translateQueue', text);
    })
}

// hi @2uan2, please resolve issue #2
ocrFilter();