import 'dotenv/config';

import app from './app';
import router from './router';
import config from './config';

app.use(router);

app.listen(config.serverPort, () => {
  console.log(`Server is listening on port ${config.serverPort}...`);
});
