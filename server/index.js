import './config';
import '@babel/polyfill';
import server from './app';

try {
  const { PORT } = process.env;

  server.listen(PORT, () => {
    console.log(`Koa is listening in ${PORT}`);
  });
} catch (e) {
  console.log(e);
}
