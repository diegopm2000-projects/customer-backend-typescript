/* eslint-disable @typescript-eslint/no-explicit-any */

export enum LOG_LEVEL {
  error = 'error',
  warn = 'warn',
  info = 'info',
  debug = 'debug',
}

export enum LOG_LOCATION {
  IN = 'IN',
  MID = 'MID',
  OUT = 'OUT',
  ERROR = 'ERROR',
}

export type LogParameters = {
  fn: string
  loc?: LOG_LOCATION
  message: string
  metadata?: any
}

export type CompleteLogParameters = LogParameters & {
  level: LOG_LEVEL
}

export interface ILogger {
  debug(params: { fn: string; loc?: LOG_LOCATION; message: string; metadata?: any }): void
  info(params: { fn: string; loc?: LOG_LOCATION; message: string; metadata?: any }): void
  warn(params: { fn: string; loc?: LOG_LOCATION; message: string; metadata?: any }): void
  error(params: { fn: string; loc?: LOG_LOCATION; message: string; metadata?: any }): void

  log(params: { level: LOG_LEVEL; fn: string; loc?: string; message: string; metadata?: any }): void
}
