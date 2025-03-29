import { Container } from 'inversify'
import { TYPES } from './types'

import { IAppConfig } from '../../../../app/IAppConfig'
import { ICustomerRepository } from '../../../main/customer/domain/repositories/ICustomer.repository'
import { CustomerMongoDBRepository } from '../../../main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { GetAllCustomersUseCase } from '../../../main/customer/usecases/GetAllCustomers/GetAllCustomers.usecase'
import { IGetAllCustomersUseCase } from '../../../main/customer/usecases/GetAllCustomers/IGetAllCustomers.usecase'
import { GetCustomerByIdUseCase } from '../../../main/customer/usecases/GetCustomerById/GetCustomerById.usecase'
import { IMongoDBInfra } from '../persistence/mongodb/IMongoDBInfra'
import { MongodBInfra } from '../persistence/mongodb/MongoDBInfra'
import { IGetCustomerByIdUseCase } from '../../../main/customer/usecases/GetCustomerById/IGetCustomerById.usecase'

export class DependencyContainer {
  public static init(appConfig: IAppConfig): Container {
    const container = new Container()

    // Infrastructure
    container.bind<IMongoDBInfra>(TYPES.IMongoDBInfra).toConstantValue(new MongodBInfra({ uri: appConfig.mongodburi }))

    // MongoDB Collections
    container.bind<string>(TYPES.CustomerCollection).toConstantValue('customers')

    // Repositories
    container.bind<ICustomerRepository>(TYPES.ICustomerRepository).to(CustomerMongoDBRepository).inSingletonScope()

    // UseCases
    container.bind<IGetAllCustomersUseCase>(TYPES.IGetAllCustomersUseCase).to(GetAllCustomersUseCase).inSingletonScope()
    container.bind<IGetCustomerByIdUseCase>(TYPES.IGetCustomerByIdUseCase).to(GetCustomerByIdUseCase).inSingletonScope()

    return container
  }
}
