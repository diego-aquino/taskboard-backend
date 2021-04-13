import accountsComponents from './accountsComponents';
import securityComponents from './securityComponents';

const globalSchemas = {
  global: {
    error: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};

const globalComponents = { schemas: globalSchemas };

export { globalComponents, accountsComponents, securityComponents };
