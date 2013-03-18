
var express = require('express')
  , app = module.exports = express()
  , Batch = require('../batch')
  , User = require('./user')
  , Todo = require('../todos/todo');

app.get('/users/:id', function(req, res) {
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
        user.todos = todos;
        res.send(user);
      });
    });
  });
});

app.post('/users', function(req, res) {
  User.find(req.param('id'), function(err, user) {
    if (err) return res.send({messageType: 'error', message: "Internal error."});

    if (!user.data) {
      user.data = { name: req.param('name') };
    } else {
      return res.send({messageType: 'error', message: "User already exits."});
    }

    user.save(function(err) {
      if (err) return res.send({messageType: 'error', message: "Couldn't create user."});
      return res.send(user);
    });
  });

});

app.patch('/users/:id', function(req, res) {
  User.find(req.params.id, function(err, user) {
    if (err || !user.data) return res.send({messageType: 'error', message: "No such user found."});

    user.data.name = req.param('name');

    user.save(function(err) {
      if (err) return res.send({messageType: 'error', message: "Couldn't update user."});
      return res.send(user);
    });
  });
});
