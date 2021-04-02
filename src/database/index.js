import mongoose from 'mongoose';

import config from '~/config';

function registerConnectionListeners() {
  mongoose.connection.on('connected', () => {
    console.log('[database] Connected successfully to database');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`[database] Database connection error: ${error}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.error('[database] Application disconnected from database');
  });
}

async function connect() {
  if (config.environment !== 'test') {
    registerConnectionListeners();
  }

  await mongoose.connect(config.database.connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}

async function disconnect() {
  await mongoose.connection.close();
}

const database = { connect, disconnect };

export default database;
