
var express = require('express')
  , app = module.exports = express()
  , redisSetup = require('../db/')
  , redis = redisSetup.redis
  , db = app.db = redisSetup.client
  , userKey = 'test:user:'
  , todoKey = 'test:todo:'
  , Batch = require('../batch');

app.get('/users/:id/todos', function(req, res) {
  var batch = new Batch();
  db.lrange(userKey + req.params.id + ':todos', 0, -1, function(err, todoIds) {
    if (err) throw err;

    todoIds.forEach(function(id) {
      batch.push(function(fn) {
        db.hgetall(todoKey + id, fn);
      });
    });

    batch.end(function(err, todos) {
      if (err) throw err;
      res.send(todos);
    });
  });
});

app.get('/users/:id/todos/:todoId', function(req, res) {
  db.hgetall(todoKey + req.params.todoId, function(err, todo) {
    if (err) throw err;
    todo.id = req.params.todoId;
    res.send(todo);
  });
});

app.post('/users/:id/todos', function(req, res) {
  // the toString is used as a temporary fix because
  // node-redis doesn't support adding data types such
  // as `number`, `boolean` etc as values for hashes

  var now = Date.now().toString()
    , todo = {
      content: req.param('content'), // refer Note 1
      status: 'tbs',
      created_at: now,
      updated_at: now
    };

  // Note 1: req.param('content') is used instead of req.body.content
  // because it provides a consistent API. Right now the tests use
  // supertest which doesn't seem to be supporting the #send call and
  // so the had to end up using the req.param method.
  // We should favor req.params or req.body or req.query for clarity acc. to TJ.
  // Also, req.param looks up in the above mentioned order.

  db.get(todoKey + 'id', function(err, id) {
    todo.id = id;
    db.hmset(todoKey + id, todo, function() {
      db.lpush('test:user:' + req.params.id + ':todos', id);
      db.incr(todoKey + 'id');
      res.send(todo);
    });
  });

});

app.patch('/users/:id/todos/:todoId', function(req, res) {
  db.hgetall(todoKey + req.params.todoId, function(err, todo) {
    if (err) throw err;
    if (req.param('content')) {
      todo.content = req.param('content');
    }
    if (req.param('status')) {
      todo.status = req.param('status');
    }
    todo.updated_at = Date.now().toString();
    db.hmset(todoKey + req.params.todoId, todo, function() {
      res.send(todo);
    });
  });
});

app.del('/users/:id/todos/:todoId', function(req, res) {
  var multi = db.multi()
    , userId = req.params.id
    , todoId = req.params.todoId;

  multi.lrem(userKey + req.params.id + ':todos', 0, req.params.todoId);
  multi.del(todoKey + req.params.todoId);
  multi.exec(function(err, replies) {
    res.send(true);
  });
});
