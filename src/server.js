import app from './app';
import router from './router';

app.use(router);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
