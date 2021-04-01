const config = {
  serverPort: parseInt(process.env.SERVER_PORT) || 3333,
  database: {
    connectionUri: `mongodb+srv://${encodeURIComponent(
      process.env.DATABASE_CONNECTION_USERNAME,
    )}:${encodeURIComponent(
      process.env.DATABASE_CONNECTION_PASSWORD,
    )}@main.pr5bv.mongodb.net/${encodeURIComponent(
      process.env.DATABASE_NAME,
    )}?retryWrites=true&w=majority`,
  },
};

export default config;
