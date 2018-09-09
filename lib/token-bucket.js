const redis = require('../app/redis')

class TokenBucket {
  constructor(capacity, interval, id) {
    this.capacity = capacity
    this.interval = interval * 1000
    this.id = id
  }

  async drain(tokens = 1) {
    const now = Date.now()

    // first remove old entries
    await redis.zremrangebyscore(`crc:${this.id}`, 0, now - this.interval)

    const usedTokens = redis.zcard(`crc:${this.id}`)
    let available = this.capacity - usedTokens

    if (available >= tokens) {
      for (let idx = 0; idx < tokens; idx++) {
        await redis.zadd(`crc:${this.id}`, now, now)
      }
    }

    return available
  }
}

module.exports = TokenBucket
