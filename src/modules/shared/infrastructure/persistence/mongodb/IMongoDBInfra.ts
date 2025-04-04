import { Db } from 'mongodb'

export interface IMongoDBInfra {
  getConnectionDb(): Promise<Db>
  closeConnectionDb(): Promise<void>
}
