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
      example: {
        firstName: 'Diego',
        lastName: 'Aquino',
        email: 'diegoaquino@example.com',
        password: 'O1@2Ff)wo@$na6490',
      },
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
      example: {
        account: {
          id: '6075c1b4b649d40015af4f62',
          firstName: 'Diego',
          lastName: 'Aquino',
          email: 'diegoaquino@example.com',
        },
        accessToken: '937f0d5cbba322c5bd8025663b72b11e',
        refreshToken: '429ee8e85dc2a805bf47656cf8bfe108',
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
      example: {
        account: {
          id: '6075c1b4b649d40015af4f62',
          firstName: 'Diego',
          lastName: 'Aquino',
          email: 'diegoaquino@example.com',
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
      example: {
        email: 'diegoaquino@example.com',
        password: 'O1@2Ff)wo@$na6490',
      },
    },
    successResponse: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
      example: {
        accessToken: '937f0d5cbba322c5bd8025663b72b11e',
        refreshToken: '429ee8e85dc2a805bf47656cf8bfe108',
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
      example: {
        refreshToken: '429ee8e85dc2a805bf47656cf8bfe108',
      },
    },

    successResponse: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
      },
      example: {
        accessToken: '937f0d5cbba322c5bd8025663b72b11e',
      },
    },
  },
};

const accountsComponents = { schemas };

export default accountsComponents;
