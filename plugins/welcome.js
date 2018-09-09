const config = require('../app/config')
const logger = require('../app/logger')

exports.init = function init(app) {
  app.client.on('guildMemberAdd', guildMemberAdd)
  app.client.on('guildMemberRemove', guildMemberRemove)
  return Promise.resolve()
}

function guildMemberAdd(member) {
  logger.verbose('%s (%s) joined the CRC', member.displayName, member.user)
  const msg = config.message
    .replace(/:NAME:/g, member.displayName)
    .replace(/:MENTION:/g, member.user)
  return member.send(msg)
}

function guildMemberRemove(member) {
  logger.info('%s (%s) left the CRC', member.displayName, member.user)
}
