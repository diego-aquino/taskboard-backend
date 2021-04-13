const schemas = {
  signup: {
    accountInfo: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['firstName', 'lastName', 'email', 'password'],
    },
    successResponse: {
      type: 'object',
      properties: {
        account: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
          },
        },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  },

  details: {
    successResponse: {
      type: 'object',
      properties: {
        account: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  },

  login: {
    credentials: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },

    successResponse: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  },

  token: {
    credentials: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
      required: ['refreshToken'],
    },

    successResponse: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
      },
    },
  },
};

const accountsComponents = { schemas };

export default accountsComponents;
