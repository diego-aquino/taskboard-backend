import { Router } from 'express';

const router = Router();

router.get('/hello', (_, response) =>
  response.json({ message: 'Hello world!' }),
);

export default router;
