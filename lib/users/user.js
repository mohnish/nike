
var dbSetup = require('../db/')
  , db = dbSetup.client
  , userKey = 'nike:user:';

module.exports = User;

function User(id, data) {
  if (!this instanceof User) return new User(id, data);
  this.id = id;
  this.data = data;
}

User.find = function(id, fn) {
  db.hgetall(userKey + id, function(err, obj) {
    if (err) return fn(err);
    fn(null, new User(id, obj));
  });
};

User.prototype.save = function(fn) {
  if (!this.isValid()) return fn('error');
  db.hmset(userKey + this.id, this.data, fn);
};

User.prototype.getTodos = function(fn) {
  db.lrange(userKey + this.id + ':todos', 0, -1, fn);
};

User.prototype.isValid = function() {
  var regex = /^[A-Za-z]\w{1,10}$/;
  return this.id !== undefined && regex.test(this.id);
};
