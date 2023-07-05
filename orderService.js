import rascal from 'rascal';
import { brokerConfig } from './config.js';

const dummyOrder = {
  orderId: '111',
  product: {
    productId: '4141414212',
    productDescription: 'Nike Air Jordan shoes',
    size: '10',
  },
};

const run = async () => {
  try {
    const broker = await rascal.BrokerAsPromised.create(brokerConfig);
    // await broker.publish("email_publication", orderData);
    for (let i = 1; i < 5; i++) {
      await broker.publish('email_publication', { ...dummyOrder, orderId: i });
    }
  } catch (err) {
    console.error(err);
  }
};

run().catch((err) => console.error(err.message));
