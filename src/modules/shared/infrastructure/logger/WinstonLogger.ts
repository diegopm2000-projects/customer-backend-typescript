/* eslint-disable @typescript-eslint/no-explicit-any */

import { Logger } from 'winston'
import * as rTracer from 'cls-rtracer'

import { CompleteLogParameters, LogParameters, LOG_LEVEL } from './ILogger'

export class WinstonLogger {
  protected _logger: Logger

  constructor(logger: Logger) {
    this._logger = logger
  }

  static buildRequestId(): string {
    return rTracer.id() ? `(${rTracer.id()})` : '(no req-id)'
  }

  private buildMessage(params: LogParameters) {
    return { fn: params.fn, loc: params.loc ? params.loc : 'MID', ...params.metadata }
  }

  public log(params: CompleteLogParameters): void {
    this._logger.log(params.level, params.message, this.buildMessage(params))
  }

  public debug(params: LogParameters): void {
    this.log({ level: LOG_LEVEL.debug, ...params })
  }

  public info(params: LogParameters): void {
    this.log({ level: LOG_LEVEL.info, ...params })
  }

  public warn(params: LogParameters): void {
    this.log({ level: LOG_LEVEL.warn, ...params })
  }

  public error(params: LogParameters): void {
    this.log({ level: LOG_LEVEL.error, ...params })
  }
}
