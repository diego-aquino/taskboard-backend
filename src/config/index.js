import generateDatabaseConfig from './database';
import docsConfig from './docs';

const environment = process.env.NODE_ENV || 'development';

const config = {
  environment,
  serverPort: parseInt(process.env.PORT) || 3333,
  database: generateDatabaseConfig(environment),
  jwt: {
    accessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
    refreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
    sessionExpiresIn: '5m',
  },
  docs: docsConfig,
  tasks: {
    listedTasksPerPage: environment === 'test' ? 3 : 10,
  },
};

export default config;
