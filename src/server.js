import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import routes from '~/routes';
import config from '~/config';
import database from '~/database';

const server = express();
server.use(express.json());
server.use(cors());

database.connect();

server.use(routes);

server.listen(config.serverPort, () => {
  console.log(`[server] Server is listening on port ${config.serverPort}...`);
});
