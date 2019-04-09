import Koa from 'koa';
import mainMiddlwares from './middlwares/mainMidlwares';
import routes from './routes';

import './db/index';

const app = new Koa();

mainMiddlwares(app);

app.use(routes);


const { VUE_APP_SERVER_PORT } = process.env;

app.listen(VUE_APP_SERVER_PORT, () => {
  console.log(`Koa is listening in ${VUE_APP_SERVER_PORT}`);
});

export default app;
