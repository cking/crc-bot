const config = require('./config')

const Redis = require('ioredis')
const redis = new Redis(
  config.redis.port || 6379,
  config.redis.host || 'localhost',
  {
    db: config.redis.db || 0
  }
)

module.exports = redis
