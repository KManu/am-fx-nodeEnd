const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cluster = require('cluster');
const os = require('os');
const cors = require('cors');

const routes = require('./lib/routes.js');
const auth = require('./lib/shared/jwt_auth');
const { connectDb } = require('./lib/db/db.index');
const { PORT, NODE_ENV } = require('./env.config');

global.Promise = require('bluebird');


if (NODE_ENV === 'production') {
  const CPUS = os.cpus();
  if (cluster.isMaster) {
    // create a worker for each cpu
    CPUS.forEach(() => cluster.fork());

    cluster.on('listening', (worker) => {
      console.log('Worker %d connected', worker.process.pid);
    });

    cluster.on('disconnect', (worker) => {
      console.log('Worker %d disconnected', worker.process.pid);
    });

    cluster.on('exit', (worker) => {
      console.log('Worker %d is dead', worker.process.pid);
      // Ensure starts of a new worker if an old one dies
      cluster.fork();
    });
  } else {
    startApp();
  }
} else {
  // create just one instance for dev
  startApp();
}

function startApp() {
  const app = express();
  app.set('port', PORT);


  // Access logging
  const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
  app.use(morgan(':date[iso] - :referrer - :remote-addr - :user-agent - :method - :url | :status - :response-time ', { stream: accessLogStream }));

  // Body Parser
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));

  // Security plugins
  NODE_ENV === 'development' && app.use(cors()); // Not using cors because headers are already set by nginx
  app.use(helmet());


  // jwt init
  app.use(auth.initialize());


  // Route setup
  routes.routes(app);

  connectDb()
    .then(() => {
      console.log('DB Connected.');
      app.listen(app.get('port'), () => {
        console.log('Server ALLL the way up on', app.get('port') + ' in ' + NODE_ENV + ' mode.');
      });
    })
    .catch((error) => {
      console.log('Error connecting to DB: ', error);
    });
}