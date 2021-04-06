function generateMongoConnectionUri(username, password, databaseName) {
  return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(
    password,
  )}@main.pr5bv.mongodb.net/${encodeURIComponent(
    databaseName,
  )}?retryWrites=true&w=majority`;
}

function generateDatabaseConfig(environment) {
  if (environment === 'test') {
    return {
      connectionUri: process.env.MONGO_URL,
    };
  }

  return {
    connectionUri: generateMongoConnectionUri(
      process.env.DATABASE_CONNECTION_USERNAME,
      process.env.DATABASE_CONNECTION_PASSWORD,
      process.env.DATABASE_NAME,
    ),
  };
}

export default generateDatabaseConfig;
