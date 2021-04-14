const schemas = {
  validationErrorInvalidOrRequiredFields: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    example: {
      message: 'Invalid or missing required field(s).',
    },
  },

  validationErrorInvalidFields: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    example: {
      message: 'Invalid field(s).',
    },
  },

  emailAlreadyInUse: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    example: {
      message: 'Email is already in use.',
    },
  },

  invalidAccessToken: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    example: {
      message: 'Invalid or missing access token.',
    },
  },

  invalidRefreshToken: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    example: {
      message: 'Invalid or missing refresh token.',
    },
  },

  accountNotFound: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    example: {
      message: 'Account not found.',
    },
  },

  taskNotFound: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    example: {
      message: 'Task not found.',
    },
  },

  invalidLoginCredentials: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    example: {
      message: 'Email and/or password do not match.',
    },
  },
};

const errorComponents = { schemas };

export default errorComponents;
