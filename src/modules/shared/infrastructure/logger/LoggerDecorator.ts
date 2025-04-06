/* eslint-disable @typescript-eslint/no-explicit-any */

import * as util from 'util'
import { LOG_LEVEL, LOG_LOCATION } from './ILogger'

import { LogFacade } from './LogFacade'

const CALLED_WITH_ARGS_MSG = 'called with args:'

function errorHandler(logFacade: LogFacade, originalMethodName: string, error: any) {
  if (error instanceof Error) {
    logFacade.logger.log({
      level: LOG_LEVEL.error,
      fn: originalMethodName,
      loc: LOG_LOCATION.ERROR,
      message: 'error.message',
      metadata: { errorMessage: error.message },
    })
    logFacade.logger.log({ level: LOG_LEVEL.error, fn: originalMethodName, loc: LOG_LOCATION.ERROR, message: `error.stack: ${error.stack}` })
    throw error
  } else {
    logFacade.logger.log({ level: LOG_LEVEL.error, fn: originalMethodName, loc: LOG_LOCATION.ERROR, message: 'unknown error' })
  }
}

export const logMethod = (logLevel: LOG_LEVEL) => (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any) {
    const logFacade = new LogFacade(this.constructor.name)
    logFacade.logger.log({ level: logLevel, fn: originalMethod.name, loc: LOG_LOCATION.IN, message: CALLED_WITH_ARGS_MSG, metadata: { args } })

    let result
    try {
      result = originalMethod.apply(this, args)
      if (result instanceof Error) {
        logFacade.logger.log({
          level: logLevel,
          fn: originalMethod.name,
          loc: LOG_LOCATION.OUT,
          message: `exited RESPONSE ERROR with message: ${result.message}`,
        })
      } else {
        logFacade.logger.log({ level: logLevel, fn: originalMethod.name, loc: LOG_LOCATION.OUT, message: 'exited OK with result:', metadata: { result } })
      }
    } catch (error) {
      errorHandler(logFacade, originalMethod.name, error)
    }
    return result
  }
  return descriptor
}

export const asyncLogMethod = (logLevel: LOG_LEVEL) => (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: any) {
    const logFacade = new LogFacade(this.constructor.name)
    logFacade.logger.log({ level: logLevel, fn: originalMethod.name, loc: LOG_LOCATION.IN, message: CALLED_WITH_ARGS_MSG, metadata: { args } })

    let result
    try {
      result = await originalMethod.apply(this, args)
      if (result instanceof Error) {
        logFacade.logger.log({
          level: logLevel,
          fn: originalMethod.name,
          loc: LOG_LOCATION.OUT,
          message: `exited RESPONSE ERROR with message: ${result.message}`,
        })
      } else {
        logFacade.logger.log({ level: logLevel, fn: originalMethod.name, loc: LOG_LOCATION.OUT, message: 'exited OK with result:', metadata: { result } })
      }
    } catch (error) {
      errorHandler(logFacade, originalMethod.name, error)
    }
    return result
  }
  return descriptor
}

export const logClassCreate = (logLevel: LOG_LEVEL) =>
  function innerLogClassCreate<T extends { new (...args: any[]): any }>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args)
        const logFacade = new LogFacade(util.inspect(target.name))
        logFacade.logger.log({ level: logLevel, fn: 'constructor', loc: LOG_LOCATION.IN, message: CALLED_WITH_ARGS_MSG, metadata: { args } })
        logFacade.logger.log({ level: logLevel, fn: 'constructor', loc: LOG_LOCATION.OUT, message: 'built:', metadata: this })
      }
    }
  }
