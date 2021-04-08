import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import routes from '~/routes';
import '~/validators/setup';

const app = express();
app.use(express.json());
app.use(cors());

app.use(routes);

export default app;
