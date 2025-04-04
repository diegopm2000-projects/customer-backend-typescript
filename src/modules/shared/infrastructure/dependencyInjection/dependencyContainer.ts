import { Container } from 'inversify'
import { TYPES } from './types'

import { IAppConfig } from '../../../../app/IAppConfig'
import { CreateCustomerController } from '../../../main/customer/api/apirest/CreateCustomer.controller'
import { GetAllCustomersController } from '../../../main/customer/api/apirest/GetAllCustomers.controller'
import { GetCustomerByIdController } from '../../../main/customer/api/apirest/GetCustomerById.controller'
import { CreateCustomerUseCase } from '../../../main/customer/application/usecases/CreateCustomer/CreateCustomer.usecase'
import { ICreateCustomerUseCase } from '../../../main/customer/application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { DeleteCustomerByIdUseCase } from '../../../main/customer/application/usecases/DeleteCustomerById/DeleteCustomerById.usecase'
import { IDeleteCustomerByIdUseCase } from '../../../main/customer/application/usecases/DeleteCustomerById/IDeleteCustomerById.usecase'
import { GetAllCustomersUseCase } from '../../../main/customer/application/usecases/GetAllCustomers/GetAllCustomers.usecase'
import { IGetAllCustomersUseCase } from '../../../main/customer/application/usecases/GetAllCustomers/IGetAllCustomers.usecase'
import { GetCustomerByIdUseCase } from '../../../main/customer/application/usecases/GetCustomerById/GetCustomerById.usecase'
import { IGetCustomerByIdUseCase } from '../../../main/customer/application/usecases/GetCustomerById/IGetCustomerById.usecase'
import { IUpdateCustomerUseCase } from '../../../main/customer/application/usecases/UpdateCustomer/IUpdateCustomer.usecase'
import { UpdateCustomerUseCase } from '../../../main/customer/application/usecases/UpdateCustomer/UpdateCustomer.usecase'
import { ICustomerRepository } from '../../../main/customer/domain/repositories/ICustomer.repository'
import { CustomerMongoDBRepository } from '../../../main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { ExpressInfra } from '../express/ExpressInfra'
import { IExpressInfra } from '../express/IExpressInfra'
import { IMongoDBInfra } from '../persistence/mongodb/IMongoDBInfra'
import { MongodBInfra } from '../persistence/mongodb/MongoDBInfra'
import { DeleteCustomerByIdController } from '../../../main/customer/api/apirest/DeleteCustomerById.controller'
import { UpdateCustomerController } from '../../../main/customer/api/apirest/UpdateCustomer.controller'
import { IAddAvailableCreditUseCase } from '../../../main/customer/application/usecases/AddAvailableCredit/IAddAvailableCredit.usecase'
import { AddAvailableCreditUseCase } from '../../../main/customer/application/usecases/AddAvailableCredit/AddAvailableCredit.usecase'
import { AddAvailableCreditController } from '../../../main/customer/api/apirest/AddAvailableCredit.controller'

export class DependencyContainer {
  public static init(appConfig: IAppConfig): Container {
    const container = new Container()

    // Infrastructure
    container.bind<IMongoDBInfra>(TYPES.IMongoDBInfra).toConstantValue(new MongodBInfra({ uri: appConfig.mongodburi }))
    container.bind<IExpressInfra>(TYPES.IExpressInfra).toConstantValue(new ExpressInfra({ port: appConfig.expressPort }))

    // MongoDB Collections
    container.bind<string>(TYPES.CustomerCollection).toConstantValue('customers')

    // Repositories
    container.bind<ICustomerRepository>(TYPES.ICustomerRepository).to(CustomerMongoDBRepository).inSingletonScope()

    // UseCases
    container.bind<IGetAllCustomersUseCase>(TYPES.IGetAllCustomersUseCase).to(GetAllCustomersUseCase).inSingletonScope()
    container.bind<IGetCustomerByIdUseCase>(TYPES.IGetCustomerByIdUseCase).to(GetCustomerByIdUseCase).inSingletonScope()
    container.bind<ICreateCustomerUseCase>(TYPES.ICreateCustomerUseCase).to(CreateCustomerUseCase).inSingletonScope()
    container.bind<IUpdateCustomerUseCase>(TYPES.IUpdateCustomerUseCase).to(UpdateCustomerUseCase).inSingletonScope()
    container.bind<IDeleteCustomerByIdUseCase>(TYPES.IDeleteCustomerByIdUseCase).to(DeleteCustomerByIdUseCase).inSingletonScope()
    container.bind<IAddAvailableCreditUseCase>(TYPES.IAddAvailableCreditUseCase).to(AddAvailableCreditUseCase).inSingletonScope()

    // Controllers
    container.bind<GetCustomerByIdController>(TYPES.GetCustomerByIdController).to(GetCustomerByIdController).inSingletonScope()
    container.bind<GetAllCustomersController>(TYPES.GetAllCustomersController).to(GetAllCustomersController).inSingletonScope()
    container.bind<CreateCustomerController>(TYPES.CreateCustomerController).to(CreateCustomerController).inSingletonScope()
    container.bind<DeleteCustomerByIdController>(TYPES.DeleteCustomerByIdController).to(DeleteCustomerByIdController).inSingletonScope()
    container.bind<UpdateCustomerController>(TYPES.UpdateCustomerController).to(UpdateCustomerController).inSingletonScope()
    container.bind<AddAvailableCreditController>(TYPES.AddAvailableCreditController).to(AddAvailableCreditController).inSingletonScope()

    return container
  }
}
