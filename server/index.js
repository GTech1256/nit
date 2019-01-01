import '@babel/polyfill';
import dotenv from 'dotenv';
import server from './app';

dotenv.config();

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Koa is listening in ${PORT}`);
});
