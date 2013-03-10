
var app = require('../lib/users')
  , request = require('supertest');

describe('GET /users/id', function() {
  it('responds with the user info & todos', function(done) {
    request(app)
      .get('/users/mohnish')
      .end(function(err, res) {
        var result = res.body;
        result.should.have.property('info');
        result.info.should.have.property('name');
        result.info.should.have.property('id');
        result.should.have.property('todos');
        result.todos.should.not.be.empty;
        done();
      });
  });
});

describe('POST /users/', function() {
  it('creates a user', function(done) {
    // ~~~ Create a user and destroy them.
    // Tests can't be bound to existing data
    request(app)
      .post('/users')
      .query({name: "mohnish thallavajhula", id: "mohnish"})
      .end(function(err, res) {
        var result = res.body;
        result.info.should.have.property('name');
        result.info.should.have.property('id');
        result.should.have.property('todos');
        result.todos.should.be.empty;
        done();
      });
  });
});
