const logger = require('winston')
logger.level = 'debug'

// fudge - by default winston disables timestamps on the console
logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, { prettyPrint: true, timestamp: true })

module.exports = logger
