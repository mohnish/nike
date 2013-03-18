
var express = require('express')
  , app = module.exports = express()
  , Batch = require('../batch')
  , Todo = require('./todo')
  , User = require('../users/user');

app.get('/users/:id/todos', function(req, res) {
  var batch = new Batch();

  User.find(req.params.id, function(err, user) {
    if (err || !user.data) return res.send({messageType: 'error', message: "No such user found."});

    user.getTodos(function(err, todoIds) {
      if (err) return res.send({messageType: 'error', message: "No such user found."});

      todoIds.forEach(function(id) {
        batch.push(function(fn) {
          Todo.find(id, fn);
        });
      });

      batch.end(function(err, todos) {
        if (err) return res.send({messageType: 'error', message: "Internal error."});
        res.send(todos);
      });
    });
  });
});

app.get('/users/:id/todos/:todoId', function(req, res) {
  Todo.find(req.params.todoId, function(err, todo) {
    if (err || !todo.data) return res.send({messageType: 'error', message: 'No todo matches that ID'});

    res.send(todo);
  });
});

app.post('/users/:id/todos', function(req, res) {
  // the toString is used as a temporary fix because
  // node-redis doesn't support adding data types such
  // as `number`, `boolean` etc as values for hashes

  // Note: req.param('content') is used instead of req.body.content
  // because it provides a consistent API. Right now the tests use
  // supertest which doesn't seem to be supporting the #send call and
  // so I had to end up using the req.param method.
  // req.params or req.body or req.query should be favored for clarity acc. to TJ.
  // Also, req.param looks up in the above mentioned order.

  var now = Date.now().toString()
    , data = {
      content: req.param('content'),
      status: req.param('status'),
      created_at: now,
      updated_at: now
    };

  Todo.getNextId(function(err, id) {
    var todo = new Todo(id, data);

    User.find(req.params.id, function(err, user) {
      if (err || !user.data) return res.send({messageType: 'error', message: "No such user exists."});
      todo.save(req.params.id, false, function(err) {
        if (err) return res.send({messageType: 'error', message: 'Unable to save the todo.'});
        res.send(todo);
      });
    });
  });
});

app.patch('/users/:id/todos/:todoId', function(req, res) {
  Todo.find(req.params.todoId, function(err, todo) {
    if (err || !todo.data) return res.send({messageType: 'error', message: 'No todo matches that ID'});

    todo.data.content = req.param('content');
    todo.data.status = req.param('status');
    todo.data.updated_at = Date.now().toString();

    todo.save(req.params.todoId, true, function(err) {
      res.send(todo);
    });
  });
});

app.del('/users/:id/todos/:todoId', function(req, res) {
  Todo.find(req.params.todoId, function(err, todo) {
    todo.destroy(req.params.id, function(err) {
      res.send({messageType: 'info', message: 'Todo with the ID: ' + req.params.todoId + ' deleted.'});
    });
  });
});
