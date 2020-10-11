// get node postgres connectoin
const { Pool } = require('pg');
import debug from 'debug';
import configuration from '../config/config';

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

//const config = configuration[env];

console.log('This is the environment: ', env );
try {
  if (env === 'production') {
    const pool = new Pool({connectionString: process.env.DB_URL ? process.env.DB_URL : configuration.production.url});
    module.exports = pool;
  } else if (env === 'test') {
    const pool = new Pool(configuration.test);
    module.exports = pool;
  } else {
  const pool = new Pool(configuration.development);
  module.exports = pool;
  }
}catch(error){
  debug('app:*')(`Database not connected`);
}

