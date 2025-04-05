/* eslint-disable @typescript-eslint/no-explicit-any */

import { createLogger, format, transports } from 'winston'
import winstonTimestampColorize from 'winston-timestamp-colorize'
import { ILogger, LOG_LEVEL } from './ILogger'
import { WinstonLogger } from './WinstonLogger'
import JSONBig from 'json-bigint'

export class WinstonFlatLogger extends WinstonLogger implements ILogger {
  static printer(info: any) {
    const { timestamp, level, component, fn, loc, message, ...rest } = info
    return `[${timestamp}]${WinstonLogger.buildRequestId()} ${level} [${component}]:${fn} (${loc}) --> ${message} :--: ${Object.keys(rest).length === 0 ? '' : JSONBig.stringify(rest)}`
  }

  constructor(defaultMeta: any) {
    const { combine, colorize, timestamp } = format
    super(
      createLogger({
        level: process.env.APP_LOG_LEVEL ? process.env.APP_LOG_LEVEL : LOG_LEVEL.info,
        defaultMeta,
        format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winstonTimestampColorize({ color: 'yellow' }), format.printf(WinstonFlatLogger.printer)),
        transports: [new transports.Console()],
      })
    )
  }
}
