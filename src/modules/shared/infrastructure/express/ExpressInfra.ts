import express, { Application } from 'express'
import { Server } from 'http'
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
    this._app = express()

    this._app.use(express.json())

    this._server = this._app.listen(this._port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on http://localhost:${this._port}`)
    })

    return true
  }

  async stop(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this._server) {
        this._server.close(() => {
          console.log('----> Server stopped successfully.')
          resolve(true)
        })
      } else {
        console.warn('----> Server is not running.')
        resolve(false)
      }
    })
  }
}
