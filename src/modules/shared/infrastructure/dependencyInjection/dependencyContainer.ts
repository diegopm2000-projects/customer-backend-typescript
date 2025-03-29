import { Container } from 'inversify'
import { TYPES } from './types'

import { IAppConfig } from '../../../../app/IAppConfig'
import { CreateCustomerUseCase } from '../../../main/customer/application/usecases/CreateCustomer/CreateCustomer.usecase'
import { ICreateCustomerUseCase } from '../../../main/customer/application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { GetAllCustomersUseCase } from '../../../main/customer/application/usecases/GetAllCustomers/GetAllCustomers.usecase'
import { IGetAllCustomersUseCase } from '../../../main/customer/application/usecases/GetAllCustomers/IGetAllCustomers.usecase'
import { GetCustomerByIdUseCase } from '../../../main/customer/application/usecases/GetCustomerById/GetCustomerById.usecase'
import { IGetCustomerByIdUseCase } from '../../../main/customer/application/usecases/GetCustomerById/IGetCustomerById.usecase'
import { ICustomerRepository } from '../../../main/customer/domain/repositories/ICustomer.repository'
import { CustomerMongoDBRepository } from '../../../main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { IMongoDBInfra } from '../persistence/mongodb/IMongoDBInfra'
import { MongodBInfra } from '../persistence/mongodb/MongoDBInfra'
import { IDeleteCustomerByIdUseCase } from '../../../main/customer/application/usecases/DeleteCustomerById/IDeleteCustomerById.usecase'
import { DeleteCustomerByIdUseCase } from '../../../main/customer/application/usecases/DeleteCustomerById/DeleteCustomerById.usecase'

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
    container.bind<ICreateCustomerUseCase>(TYPES.ICreateCustomerUseCase).to(CreateCustomerUseCase).inSingletonScope()
    container.bind<IDeleteCustomerByIdUseCase>(TYPES.IDeleteCustomerByIdUseCase).to(DeleteCustomerByIdUseCase).inSingletonScope()

    return container
  }
}
