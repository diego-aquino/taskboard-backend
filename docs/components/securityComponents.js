const schemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};

const securityComponents = { schemes };

export default securityComponents;
