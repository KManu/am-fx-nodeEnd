const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const helmet = require('helmet')
const routes = require('./lib/routes.js');
const auth = require('./lib/shared/jwt_auth');
require('dotenv').config();


var app = express();
app.set('port', process.env.PORT);


// Access logging
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan(':date[iso] - :referrer - :remote-addr - :user-agent - :method - :url | :status - :response-time ', {stream: accessLogStream}))

// Body Parser
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb'}));

//Security plugins
app.use(cors());
app.use(helmet())


// jwt init
app.use(auth.initialize())


// Route setup
routes.routes(app);


app.listen(app.get('port'), ()=>{
	console.log('Server ALLL the way up on:', app.get('port'))
});