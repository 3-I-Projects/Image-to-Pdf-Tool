const amqp = require('amqplib');
require('dotenv').config();

async function connectToChannel(queueName) {
    const connection = await amqp.connect(process.env.RABBITMQ_IP);
    // const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    return { connection, channel };
}

async function sendToQueue(queueName, message) {
    const { connection, channel } = await connectToChannel(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    await channel.close();
    await connection.close();
}

async function consumeFromQueue(queueName, onMessage) {
    const { channel } = await connectToChannel(queueName);
    console.log('connected to', queueName);
    channel.consume(queueName, (msg) => {
        if (msg) {
            const message = JSON.parse(msg.content.toString());
            onMessage(message);
            channel.ack(msg);
        }
    })
}

module.exports = {
    sendToQueue,
    consumeFromQueue
}
  
  