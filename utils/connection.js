const amqp = require('amqplib');
require('dotenv').config();

async function connectToChannel(queueName) {
    const connection = await amqp.connect(process.env.RABBITMQ_IP);
    // const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    return channel;
}

async function sendToQueue(queueName, message) {
    const channel = await connectToChannel(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
}

async function consumeFromQueue(queueName, onMessage) {
    const channel = await connectToChannel(queueName);
    channel.consume(queueName, (msg) => {
        if (msg) {
            const message = JSON.parse(msg.content.toString());
            onMessage(message);
            channel.ack(msg);
        }
    })
}

// connectToChannel('test')

module.exports = {
    sendToQueue,
    consumeFromQueue
}
  
  