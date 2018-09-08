exports.init = function init(app) {
  app.addCommand({
    name: 'acc',
    desc: 'Display current Accuracy Caps for Raids in FF14',
    exec: acc
  })
}

function acc(cmd) {
  return cmd.dest.send(
    '```' +
      [
        '                Front   Flank   Caster',
        'Alex Savage     699     646     592',
        'Zurvan          699     646     582',
        'Stormblood      NONE LOL'
      ].join('\n') +
      '```'
  )
}
