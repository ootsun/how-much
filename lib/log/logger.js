import {createLogger, transports, format} from 'winston';

const consoleLevel = process.env.LOG_CONSOLE_LEVEL;

const logger = createLogger({
  transports: [
    new transports.Console({
      level: consoleLevel,
      format: format.combine(
          format.colorize(),
          format.timestamp({
            format: 'HH:mm:ss:SSS',
          }),
          format.printf(
              (info) =>
                  `${info.timestamp} [${info.level}] ${info.message}`
          )
      ),
    }),
  ],
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

function formatMessage(message) {
  let errorLine = new Error().stack.split('\n')[3];
  errorLine = errorLine.slice(errorLine.lastIndexOf('/') + 1);
  if (errorLine.endsWith(')')) {
    errorLine = errorLine.slice(0, errorLine.length - 1);
  }
  if(message instanceof String) {
    return errorLine + ' : ' + message;
  } else if(message instanceof Error){
    return `${errorLine} : ${message.message}\n${message.stack}`;
  } else {
    return errorLine + ' : ' + JSON.stringify(message);
  }
}

const log = {
  debug: (message) => {
    logger.debug(formatMessage(message));
  },
  info: (message) => {
    logger.info(formatMessage(message));
  },
  warn: (message) => {
    logger.warn(formatMessage(message));
  },
  error: (message) => {
    logger.error(formatMessage(message));
  },
  stream: logger.stream
}

export default log;
