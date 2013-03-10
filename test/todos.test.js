
var app = require('../lib/todos')
  , request = require('supertest');

describe('GET /users/user/todos', function() {
  it('responds with todos', function(done) {
    // ~~~ Create a list of todos and then check for them in the db
    // This should not be the way
    request(app)
      .get('/users/mohnish/todos')
      .end(function(err, res) {
        var result = res.body;
        result.should.be.an.instanceOf(Array);
        result.should.not.be.empty;
        done();
      });
  });
});

describe('GET /users/user/todos/id', function() {
  it('respond with a single todo', function(done) {
    // ~~~ Create a todo and destroy it. Tests can't be bound to existing data
    var result = {
      content: 'create something',
      created_at: '1362328142439',
      updated_at: '1362328142439',
      status: 'tbs',
      id: 12
    };
    request(app)
      .get('/users/mohnish/todos/12')
      .expect(result, done);
  });
});

describe('POST /users/user/todos', function() {
  it('creates and returns the todo', function(done) {
    // ~~~ Create a few todod and destroy them.
    // Tests can't be bound to existing data
    request(app)
      .post('/users/mohnish/todos')
      .query({content: 'just do it'})
      .end(function(err, res) {
        var result = res.body;
        if (err) throw err;
        result.should.have.property('content', 'just do it');
        result.should.have.property('status', 'tbs');
        result.should.have.property('created_at');
        result.should.have.property('updated_at');
        app.db.lrange('test:user:mohnish:todos', 0, -1, function(err, list) {
          app.db.get('test:todo:id', function(err, id) {
            list.should.include('15');
            done();
          });
        });
      });
  });
});

describe('PATCH /users/user/todos/id', function() {
  beforeEach(function(done) {
    var todo = {
      content: 'create something',
      created_at: '1362328142439',
      updated_at: '1362328142439',
      status: 'tbs'
    };
    app.db.hmset('test:todo:19', todo, done);
  });

  it('should update an existing todo', function(done) {
    var result = {
      content: 'create something else',
      created_at: '1362328142439',
      updated_at: '1362328142439',
      status: 'done'
    };
    request(app)
      .patch('/users/mohnish/todos/19')
      .query({content: result.content, status: result.status})
      .end(function(err, res) {
        var response = res.body;
        response.should.have.property('content', result.content);
        response.should.have.property('status', result.status);
        response.updated_at.should.not.equal('1362328142439');
        response.should.have.property('created_at', '1362328142439');
        done();
      });
  });
});

describe('DELETE /users/user/todos/id', function() {
  beforeEach(function(done) {
    var todo = {
      content: 'this is for deletion',
      created_at: '1362328142439',
      updated_at: '1362328142439',
      status: 'tbs'
    };
    app.db.hmset('test:todo:20', todo, function() {
      app.db.lpush('test:user:mohnish:todos', '20', done);
    });
  });

  it('should delete an existing todo', function(done) {
    request(app)
      .del('/users/mohnish/todos/20')
      .end(function(err, res) {
        app.db.lrange('test:user:mohnish:todos', 0, -1, function(err, todoIds) {
          todoIds.should.not.include('20');
          done();
        });
      });
  });
});
