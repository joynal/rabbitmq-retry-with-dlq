import rascal from 'rascal';
import { brokerConfig, deadLetterConfig, retryConfig } from './config.js';

async function run() {
  const broker = await rascal.BrokerAsPromised.create(brokerConfig);
  broker.on('error', console.error);
  const subscription = await broker.subscribe('email_subscription');

  subscription
    .on('message', async (message, content, ackOrNack) => {
      try {
        console.log(JSON.parse(message.content.toString()).orderId);
        ackOrNack();
      } catch (err) {
        ackOrNack('Just testing it out', retryConfig);
      }
    })
    .on('error', (err, message, ackOrNack) => {
      ackOrNack(err, deadLetterConfig);
    })
    .on('invalid_content', (err, message, ackOrNack) => {
      ackOrNack(err, deadLetterConfig);
    })
    .on('redeliveries_exceeded', (err, message, ackOrNack) => {
      console.error('Redeliveries Exceeded', err.message);
      ackOrNack(err, deadLetterConfig);
    });
}

run().catch((err) => console.error(err.message));
