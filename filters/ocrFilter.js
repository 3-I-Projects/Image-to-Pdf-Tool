const { sendToQueue, consumeFromQueue } = require('../utils/connection');
const { image2text } = require('../utils/ocr');

async function ocrFilter() {
    consumeFromQueue('ocrQueue', async (image) => {
        // console.log('image is' + image.data);
        const text = await image2text(image.path);
        const data = { id: image.id, text: text };
        console.log('text to be processed: ' + text);
        await sendToQueue('translateQueue', data);
    })
}

ocrFilter();