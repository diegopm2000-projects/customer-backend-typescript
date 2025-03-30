import { Application } from 'express'

export interface IExpressInfra {
  get app(): Application
  start(): Promise<boolean>
  stop(): Promise<boolean>
}
