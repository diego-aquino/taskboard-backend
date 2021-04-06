import generateDatabaseConfig from './database';

const environment = process.env.NODE_ENV || 'development';

const config = {
  environment,
  serverPort: parseInt(process.env.PORT) || 3333,
  database: generateDatabaseConfig(environment),
};

export default config;
