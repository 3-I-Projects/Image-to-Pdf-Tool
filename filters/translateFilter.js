const { text } = require('pdfkit');
const { sendToQueue, consumeFromQueue } = require('../utils/connection');
const { translate } = require('../utils/translate');

async function translateFilter() {
    consumeFromQueue('translateQueue', async (data) => {
        // console.log('text from translateQueue' + text);
        const translatedText = await translate(data.text);
        const translatedData = { id: data.id, text: translatedText }
        console.log('translated text: "' + translatedData.text + '"');
        sendToQueue('pdfQueue', translatedData);
    })
}

translateFilter();