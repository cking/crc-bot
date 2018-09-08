const logger = require('../app/logger')
var fs = require('fs')
var path = require('path')

exports.init = function init(app) {
  return async function init() {
    var files = await fs.readdir(__dirname)

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
}
