import { Container } from 'inversify'

import { DependencyContainer } from '../modules/shared/infrastructure/dependencyInjection/dependencyContainer'
import { IAppConfig } from './IAppConfig'
import { IMongoDBInfra } from '../modules/shared/infrastructure/persistence/mongodb/IMongoDBInfra'
import { TYPES } from '../modules/shared/infrastructure/dependencyInjection/types'

export class App {
  private _appConfig: IAppConfig

  // Inversify Container
  private _container?: Container

  get container(): Container {
    if (!this._container) {
      throw new Error('Container not initialized')
    }

    return this._container
  }

  constructor(appConfig: IAppConfig) {
    this._appConfig = appConfig
  }

  start() {
    this._container = DependencyContainer.init(this._appConfig)
  }

  async stop() {
    if (this._container) {
      await this._container.get<IMongoDBInfra>(TYPES.IMongoDBInfra).closeConnectionDb()
    }
  }
}
