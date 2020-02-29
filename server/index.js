import Koa from 'koa';
import mainMiddlwares from './middlwares/mainMidlwares';
import routes from './routes';

import './db/index';

const app = new Koa();

mainMiddlwares(app);

app.use(routes);

const { VUE_APP_SERVER_PORT, PORT, NODE_ENV } = process.env;

const serverPort = NODE_ENV === 'production' ? PORT : VUE_APP_SERVER_PORT;

app.listen(serverPort, () => {
  console.log(`Koa is listening in ${serverPort}`);
});

export default app;
