process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import validateEnv from '@utils/validateEnv';
import ImagesRoute from './routes/images.route';

validateEnv();

const app = new App([new ImagesRoute()]);

app.listen();
