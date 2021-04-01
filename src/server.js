import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import routes from '~/routes';
import config from '~/config';
import '~/database';

const server = express();
server.use(express.json());
server.use(cors());

server.use(routes);

server.listen(config.serverPort, () => {
  console.log(`[server] Server is listening on port ${config.serverPort}...`);
});
