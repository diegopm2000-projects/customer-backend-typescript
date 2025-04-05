/* eslint-disable no-console */

import * as dotenv from 'dotenv'

import { LOG_LOCATION } from '../modules/shared/infrastructure/logger/ILogger'
import { LogFacade } from '../modules/shared/infrastructure/logger/LogFacade'
import { IAppConfig } from './IAppConfig'
import { App } from './app'

export async function init(): Promise<App> {
  dotenv.config()

  console.log('---> Loading environment variables...')

  if (!process.env.MONGO_DB_URI) {
    const message = 'MONGO_DB_URI is not defined'
    throw new Error(message)
  }

  const config: IAppConfig = {
    mongodburi: process.env.MONGO_DB_URI,
    expressPort: process.env.EXPRESS_PORT ? parseInt(process.env.EXPRESS_PORT, 10) : 3000,
    appLogLevel: process.env.APP_LOG_LEVEL || 'info',
    appLogImplementation: process.env.APP_LOG_IMPLEMENTATION || 'WINSTON_FLAT',
  }

  console.log(`---> config: ${JSON.stringify(config)}`)
  const { logger, fn } = LogFacade.getInstanceAndFunctionName('bootstrap', 'init')

  logger.info({ fn, loc: LOG_LOCATION.IN, message: 'Starting application...' })

  const myApp = new App(config)
  await myApp.start()

  logger.info({ fn, loc: LOG_LOCATION.OUT, message: 'Init Completed' })

  return myApp
}
