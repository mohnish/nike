
var express = require('express')
  , app = module.exports = express()
  , redisSetup = require('../db/')
  , redis = redisSetup.redis
  , db = app.db = redisSetup.client
  , userKey = 'test:user:'
  , todoKey = 'test:todo:'
  , Batch = require('../batch');

app.get('/users/:id', function(req, res) {
  // FIXME: validate req.params.id here
  var user = {info: {}}
    , batch = new Batch();
  user.info.id = req.params.id;

  db.hgetall(userKey + user.info.id, function(err, userDetails) {
    if (err) throw err;
    user.info.name = userDetails.name;
  });

  db.lrange(userKey + user.info.id + ':todos', 0, -1, function(err, todoIds) {
    if (err) throw err;

    todoIds.forEach(function(id) {
      batch.push(function(fn) {
        db.hgetall(todoKey + id, fn);
      });
    });

    batch.end(function(err, todos) {
      if (err) throw err;
      user.todos = todos;
      res.send(user);
    });
  });
});

app.post('/users', function(req, res) {
  var user = {};
  user.info = {
    name: req.param('name'),
    id: req.param('id')
  };
  user.todos = [];

  db.hmset(userKey + req.param('id'), user.info, function() {
    res.send(user);
  });
});
