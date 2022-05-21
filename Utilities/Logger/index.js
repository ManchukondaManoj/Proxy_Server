const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf, prettyPrint, colorize} = format


const CUSTOM_FORMAT = combine(
  timestamp({ format: 'DD.MM.YYYY HH:mm:ss' }),
  prettyPrint(),
  printf(info => {
    return `[PROXY_SERVER_LOGS][${info.timestamp} - ${info.level}] ${info.message}`;
  }))


const logger = createLogger({
  level: 'info',
  format: combine(CUSTOM_FORMAT),
  transports: [
    // new transports.File({filename: 'error.log', level: 'error'}),
    new transports.File({ filename: `../Logs/${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getUTCDate()}.log`})
  ]})

//ENABLE IN DEV MODE

  logger.add(new transports.Console({
    format: combine(colorize(), CUSTOM_FORMAT)
  }))

module.exports = logger
