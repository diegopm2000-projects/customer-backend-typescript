import { MongoClient, Db } from 'mongodb'
import { IMongoDBInfra } from './IMongoDBInfra'

export class MongodBInfra implements IMongoDBInfra {
  private _uri: string
  private _client: MongoClient | undefined

  get uri(): string {
    return this._uri
  }

  constructor(params: { uri: string }) {
    this._uri = params.uri
  }

  async getConnectionDb(): Promise<Db> {
    if (!this._client) {
      this._client = new MongoClient(this.uri)
    }
    const connection = await this._client.connect()
    return connection.db()
  }

  async closeConnectionDb(): Promise<void> {
    if (this._client) {
      await this._client.close()
    }
  }
}
