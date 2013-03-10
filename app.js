
var express = require('express')
  , app = express()
  , users = require('./lib/users')
  , todos = require('./lib/todos');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

app.configure(function() {
  app.use(allowCrossDomain);
  app.use(express.bodyParser());
});

app.use(users);
app.use(todos);

app.listen(process.env.VCAP_APP_PORT || 4000);
console.log('app running on 4000');
