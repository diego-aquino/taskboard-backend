import { Router } from 'express';
import swagger from 'swagger-ui-express';

import config from '~/config';
import docs from '~docs';

const docsRoutes = Router();

docsRoutes.use('/docs', swagger.serve);
docsRoutes.get(
  '/docs',
  swagger.setup(docs, { customCss: config.docs.customSwaggerCss }),
);

export default docsRoutes;
