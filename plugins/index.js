const logger = require('../app/logger')
const fs = require('fs-extra')
const path = require('path')

exports.init = async function init(app) {
  let files = await fs.readdir(__dirname)

  files
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach(async file => {
      const filePath = path.join(__dirname, file)
      logger.debug('loading plugin from: %s', filePath)

      try {
        const plugin = require(filePath)
        await plugin.init(app)
      } catch (err) {
        logger.error('failed to load plugin: ', err)
      }
    })
}
