import express, { Application } from 'express'
import { Server } from 'http'
import { LOG_LOCATION } from '../logger/ILogger'
import { LogFacade } from '../logger/LogFacade'
import { IExpressInfra } from './IExpressInfra'

export class ExpressInfra implements IExpressInfra {
  _app?: Application
  _port: number
  _server?: Server

  get app(): Application {
    if (!this._app) {
      throw new Error('Express app not initialized')
    }
    return this._app
  }

  constructor(params: { port: number }) {
    this._port = params.port
  }

  async start(): Promise<boolean> {
    const { logger, fn } = LogFacade.getInstanceAndFunctionName(this.constructor.name, 'start')

    logger.info({ fn, loc: LOG_LOCATION.IN, message: 'Starting express server...' })

    this._app = express()

    this._app.use(express.json())

    this._server = this._app.listen(this._port, () => {
      logger.info({ fn, loc: LOG_LOCATION.IN, message: `Server is running on http://localhost:${this._port}` })
    })

    return true
  }

  async stop(): Promise<boolean> {
    const { logger, fn } = LogFacade.getInstanceAndFunctionName(this.constructor.name, 'stop')

    return new Promise((resolve) => {
      if (this._server) {
        this._server.close(() => {
          logger.info({ fn, loc: LOG_LOCATION.OUT, message: 'Server stopped successfully' })
          resolve(true)
        })
      } else {
        logger.info({ fn, loc: LOG_LOCATION.OUT, message: 'Server is not running' })
        resolve(false)
      }
    })
  }
}
