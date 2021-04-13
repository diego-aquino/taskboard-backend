import { Router } from 'express';
import swagger from 'swagger-ui-express';

import docs from '~docs';

const docsRoutes = Router();

docsRoutes.use('/docs', swagger.serve, swagger.setup(docs));

export default docsRoutes;
