export const brokerConfig = {
  vhosts: {
    '/': {
      connection: {
        url: 'amqp://guest:guest@localhost:5672',
      },
      exchanges: ['services', 'dead_letters'],
      queues: {
        email_queue: {
          options: {
            arguments: {
              'x-dead-letter-exchange': 'dead_letters',
              'x-dead-letter-routing-key': 'DeadLetter.email',
            },
          },
        },
        dl_email_queue: {},
      },
      bindings: [
        'services[Service.order.email] -> email_queue',
        'dead_letters[DeadLetter.email] -> dl_email_queue',
      ],
      publications: {
        email_publication: {
          vhost: '/',
          exchange: 'services',
          routingKey: 'Service.order.email',
        },
      },
      subscriptions: {
        email_subscription: {
          queue: 'email_queue',
          prefetch: 5,
          redeliveries: {
            limit: 2,
          },
        },
      },
    },
  },
};

export const retryConfig = [
  {
    strategy: 'republish',
    attempts: 1,
  },
  { strategy: 'nack' },
];

export const deadLetterConfig = [
  {
    strategy: 'republish',
    immediateNack: true,
  },
];
