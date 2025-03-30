/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-console */

import * as dotenv from 'dotenv'

import { IAppConfig } from './IAppConfig'
import { App } from './app'

export async function init(): Promise<void> {
  dotenv.config()

  if (!process.env.MONGO_DB_URI) {
    const message = 'MONGO_DB_URI is not defined'
    console.error(message)
    throw new Error(message)
  }

  const config: IAppConfig = {
    mongodburi: process.env.MONGO_DB_URI,
    expressPort: process.env.EXPRESS_PORT ? parseInt(process.env.EXPRESS_PORT, 10) : 3000,
  }

  const myApp = new App(config)
  myApp.start()
}
