var redis = require('redis')
  , port = "6379"
  , host = "127.0.0.1"
  , client = redis.createClient(port, host);

exports.redis = redis;
exports.client = client;