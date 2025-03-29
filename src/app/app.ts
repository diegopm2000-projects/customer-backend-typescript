/* eslint-disable no-console */

import { Container } from 'inversify'

import { CreateCustomerController } from '../modules/main/customer/api/apirest/CreateCustomer.controller'
import { DeleteCustomerByIdController } from '../modules/main/customer/api/apirest/DeleteCustomerById.controller'
import { GetAllCustomersController } from '../modules/main/customer/api/apirest/GetAllCustomers.controller'
import { GetCustomerByIdController } from '../modules/main/customer/api/apirest/GetCustomerById.controller'
import { DependencyContainer } from '../modules/shared/infrastructure/dependencyInjection/dependencyContainer'
import { TYPES } from '../modules/shared/infrastructure/dependencyInjection/types'
import { IExpressInfra } from '../modules/shared/infrastructure/express/IExpressInfra'
import { IMongoDBInfra } from '../modules/shared/infrastructure/persistence/mongodb/IMongoDBInfra'
import { IAppConfig } from './IAppConfig'
import { UpdateCustomerController } from '../modules/main/customer/api/apirest/UpdateCustomer.controller'

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

  async start() {
    this._container = DependencyContainer.init(this._appConfig)

    const expressInfra: IExpressInfra = this._container.get<IExpressInfra>(TYPES.IExpressInfra)
    await expressInfra.start()

    // Api Rest
    const BASE_API_CUSTOMERS = '/api/customers'
    expressInfra.app.get(`${BASE_API_CUSTOMERS}/:customerId`, (req, res) => this.container?.get<GetCustomerByIdController>(TYPES.GetCustomerByIdController).execute(req, res))
    expressInfra.app.get(BASE_API_CUSTOMERS, (req, res) => this.container?.get<GetAllCustomersController>(TYPES.GetAllCustomersController).execute(req, res))
    expressInfra.app.post(BASE_API_CUSTOMERS, (req, res) => this.container?.get<CreateCustomerController>(TYPES.CreateCustomerController).execute(req, res))
    expressInfra.app.put(BASE_API_CUSTOMERS, (req, res) => this.container?.get<UpdateCustomerController>(TYPES.UpdateCustomerController).execute(req, res))
    expressInfra.app.delete(`${BASE_API_CUSTOMERS}/:customerId`, (req, res) => this.container?.get<DeleteCustomerByIdController>(TYPES.DeleteCustomerByIdController).execute(req, res))
  }

  async stop() {
    if (this._container) {
      await this._container.get<IMongoDBInfra>(TYPES.IMongoDBInfra).closeConnectionDb()
      console.log('MongoDB connection closed')
      await this._container.get<IExpressInfra>(TYPES.IExpressInfra).stop()
      console.log('Express server stopped')
    }
  }
}
