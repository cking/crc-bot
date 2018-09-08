const fs = require('fs')
const path = require('path')

const config = {
  discord: {
    token: 'DISCORD_TOKEN',
    adminRole: 'admin',
    defaultGuild: '',
    playing: 'hide and seek',
    // set 'raw' to 'true' to log all events from discord
    raw: false
  },
  throttle: {
    player_lfg: {
      maxTokens: 1,
      tokenInterval: 86400
    },
    player_lfm: {
      maxTokens: 1,
      tokenInterval: 86400
    }
  },
  monitor: {
    output: 'monitor',
    events: [
      'message',
      'messageDelete',
      'messageUpdate',
      'guildMemberAdd',
      'guildMemberRemove'
    ]
  },
  welcome: {
    message: fs.readFileSync('welcome.sample.txt', 'utf8')
  },

  purge: {
    /* cron syntax
             *    *    *    *    *
             ┬    ┬    ┬    ┬    ┬
             │    │    │    │    |
             │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
             │    │    │    └───── month (1 - 12)
             │    │    └────────── day of month (1 - 31)
             │    └─────────────── hour (0 - 23)
             └──────────────────── minute (0 - 59)
            */
    partyfinder: '0 4 * * *'
  },

  accuracy: {},

  help: {},

  clear: {},

  commandPrefix: '.'
}

fs.readdirSync(path.join(__dirname, 'config')).forEach(f => {
  const base = path.basename(f, path.extname(f))
  try {
    const mod = require(path.join(__dirname, 'config', f))
    config[base] = mod
  } catch (err) {
    // ignore unsupported
  }
})
module.exports = config
