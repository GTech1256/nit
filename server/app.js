import './db/index';

import Koa from 'koa';
import mainMiddlwares from './middlwares/mainMidlwares';
import routes from './routes';

const app = new Koa();
mainMiddlwares(app);
app.use(routes);
export default app;
