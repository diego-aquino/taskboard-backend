import generateDatabaseConfig from './database';

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
};

export default config;
