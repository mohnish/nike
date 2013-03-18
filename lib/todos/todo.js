
var dbSetup = require('../db/')
  , db = dbSetup.client
  , todoKey = 'nike:todo:'
  , userKey = 'nike:user:';

module.exports = Todo;

function Todo(id, data) {
  if (!this instanceof Todo) return new Todo(id, data);
  this.id = id;
  this.data = data;
}

Todo.find = function(id, fn) {
  db.hgetall(todoKey + id, function(err, obj) {
    if (err) return fn(err);
    fn(null, new Todo(id, obj));
  });
};

Todo.getNextId = function(fn) {
  db.get(todoKey + 'id', fn);
};

Todo.prototype.save = function(userId, update, fn) {
  if(!this.isValid()) return fn('error');

  if(update) {
    db.hmset(todoKey + this.id, this.data, fn);
  } else {
    db.multi()
      .hmset(todoKey + this.id, this.data)
      .lpush(userKey + userId + ':todos', this.id)
      .incr(todoKey + 'id')
      .exec(fn);
  }
};

Todo.prototype.destroy = function(userId, fn) {
  db.multi()
    .lrem(userKey + userId + ':todos', 0, this.id)
    .del(todoKey + this.id)
    .exec(fn);
};

Todo.prototype.isValid = function() {
  var content = this.data.content, status = this.data.status;
  return !(content === undefined
    || content.trim().length == 0
    || status === undefined
    || status.trim().length == 0);
};
