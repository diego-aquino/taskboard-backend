import 'dotenv/config';

import app from '~/app';
import config from '~/config';
import database from '~/database';

database.connect();

app.listen(config.serverPort, () => {
  console.log(`[server] Server is listening on port ${config.serverPort}...`);
});
