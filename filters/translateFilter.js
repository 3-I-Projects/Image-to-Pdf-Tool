const { sendToQueue, consumeFromQueue } = require('../utils/connection');
const { translate } = require('../utils/translate');

async function translateFilter() {
    consumeFromQueue('translateQueue', async (text) => {
        // console.log('text from translateQueue' + text);
        const translatedText = await translate(text);
        console.log('translated text: "' + translatedText + '"');
        sendToQueue('pdfQueue', translatedText);
    })
}

translateFilter();