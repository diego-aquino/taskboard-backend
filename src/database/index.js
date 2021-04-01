import mongoose from 'mongoose';

import config from '~/config';

mongoose.connect(config.database.connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log('[database] Connected successfully to database');
});

mongoose.connection.on('error', (error) => {
  console.error(`[database] Database connection error: ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.error('[database] Application disconnected from database');
});
