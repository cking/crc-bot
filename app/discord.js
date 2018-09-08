const util = require('util')

const Discord = require('discord.js')

const logger = require('./logger')
const config = require('./config')

const client = new Discord.Client()

// event listeners
client.on('error', msg => logger.error(msg))
client.on('warn', msg => logger.warn(msg))
client.on('debug', msg => logger.debug(msg))

client.on('disconnect', async e => {
  logger.debug('Disconnected from discord: ' + util.inspect(e))

  // workaround discord.js not re-connecting after a clean disconnect
  if (e.code === 1000) {
    await client.destroy()
    client.login()
  }
})

if (config.discord.raw) {
  client.on('raw', function(data) {
    logger.debug('RAW: ', data)
  })
}

client.Discord = Discord
module.exports = client
