import { Application } from 'express'

export interface IExpressInfra {
  get app(): Application
  start(): Promise<void>
  stop(): Promise<void>
}
