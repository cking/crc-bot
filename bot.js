const logger = require('./app/logger')
const client = require('./app/discord')

const Warning = require('./lib/warning')
const co = require('co')
const app = {}

const config = (app.config = require('./config'))

logger.info('node version ' + process.version)
logger.info('discord.js v' + client.Discord.version)
logger.info('bot started, v' + config.pkg.version)

const commands = {}

client.once('ready', function() {
  if (config.discord.playing) {
    client.user.setGame(config.discord.playing)
  }

  logger.info('%s is ready!', client.user.username)

  logger.verbose(
    'Listening to %s channels on %s servers',
    client.channels.array().length,
    client.guilds.array().length
  )

  if (config.discord.defaultGuild) {
    // configure the default servers
    if (
      (app.defaultGuild = client.guilds.find(
        'name',
        config.discord.defaultGuild
      ))
    ) {
      logger.info(
        'setting default guild to: %s [%s]',
        app.defaultGuild.name,
        app.defaultGuild.id
      )
    } else {
      logger.warn(
        'unable to find default server: %s',
        config.discord.defaultGuild
      )
    }
  }

  client.on('messageUpdate', function(msg0, msg1) {
    parseCommand(msg1)
  })

  client.on('message', parseCommand)
})

function addCommand(cmd) {
  logger.info('adding command %s', cmd.name)
  commands[cmd.name] = cmd

  // add the aliases
  if (cmd.alias) {
    cmd.alias.forEach(function(alias) {
      logger.info('adding alias %s for command %s', alias, cmd.name)
      commands[alias] = cmd
    })
  }
}

app.addCommand = addCommand

function parseCommand(msg) {
  return co(function*() {
    // ignore commands from bots and self
    if (msg.author.id === client.user.id) return
    if (msg.author.bot) return

    let content

    // look for the command prefix or PM without the prefix
    if (msg.content.toLowerCase().startsWith(config.commandPrefix)) {
      // strip off the prefix
      content = msg.content.substring(config.commandPrefix.length)
    } else if (msg.channel.type === 'dm') {
      // see if we can still parse a command from the text
      content = msg.content
    } else {
      // these are not the droids you are looking for...
      return
    }

    const cmd = {
      msg: msg,
      dest: msg.channel
    }

    logger.debug(
      'got message from [%s] in channel [%s]: ',
      msg.author.username,
      msg.channel.name || 'PM',
      content
    )

    // split into command and args
    const args = (cmd.args = content.trim().match(/[^"\s]+|"(?:\\"|[^"])+"/g))
    const cmdName = (cmd.cmdName = args.shift().toLowerCase())

    // yep, ok then see if we have that command loaded
    if (commands[cmdName] && commands[cmdName].exec) {
      try {
        yield commands[cmdName].exec(cmd)
      } catch (err) {
        if (err instanceof Warning) {
          logger.warn(err.toString())
        } else {
          logger.error(err)
        }
      }
    }

    // silently ignore any other commands
  })
}

// start the bot
async function main() {
  // init all the commands
  const plugins = require('./plugins')
  await plugins.init(app)

  const token = await client.login(config.discord.token)
  if (!token) {
    throw new Error('Failed to acquire token')
  }
  logger.info('Logged into discord with token: ', token)
}

main().catch(error => logger.error('unexpected error occured! ' + error))
