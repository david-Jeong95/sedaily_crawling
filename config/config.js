import os from 'os';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const configFile = require('./config.json');
const configMode = configFile.run_mode;

const hostname = os.hostname();
import Hooks from '../util/logger.js';
const logger = Hooks('moment');


const config = configFile[configMode];

if (configMode === 'prod') {
  config.LOG_OUT_FILEPATH = `/logs/solution/${hostname}/search/search.out.log`;
  // config['LOG_OUT_FILEPATH'] = "/logs/solution/"+hostname+"/search/search.out.log";
  config.LOG_ERROR_FILEPATH = `/logs/solution/${hostname}/search/search.error.log`;
  // config['LOG_ERROR_FILEPATH'] = "/logs/solution/"+hostname+"/search/search.error.log";
}

logger.info('############# CHECK CONFIG MODE #############');
logger.info(`# Service PORT ::: ${config.API_SERVICE_PORT}`);
logger.info(`# ELASTICHOST ::: ${config.ELASTICSEARCH_SE_HOST}`);

export default config;
