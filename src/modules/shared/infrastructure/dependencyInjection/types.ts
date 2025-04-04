export const TYPES = {
  // //////////////////////////////////////////////////////////
  // INFRA
  // //////////////////////////////////////////////////////////

  IMongoDBInfra: Symbol.for('IMongoDBInfra'),
  IExpressInfra: Symbol.for('IExpressInfra'),

  // //////////////////////////////////////////////////////////
  // COLLECTIONS
  // //////////////////////////////////////////////////////////

  CustomerCollection: Symbol.for('CustomerCollection'),

  // //////////////////////////////////////////////////////////
  // REPOSITORIES
  // //////////////////////////////////////////////////////////

  ICustomerRepository: Symbol.for('ICustomerRepository'),

  // //////////////////////////////////////////////////////////
  // USECASES
  // //////////////////////////////////////////////////////////

  IGetAllCustomersUseCase: Symbol.for('IGetAllCustomersUseCase'),
  IGetCustomerByIdUseCase: Symbol.for('IGetCustomerByIdUseCase'),
  ICreateCustomerUseCase: Symbol.for('ICreateCustomerUseCase'),
  IDeleteCustomerByIdUseCase: Symbol.for('IDeleteCustomerByIdUseCase'),
  IUpdateCustomerUseCase: Symbol.for('IUpdateCustomerUseCase'),
  IAddAvailableCreditUseCase: Symbol.for('IAddAvailableCreditUseCase'),

  // //////////////////////////////////////////////////////////
  // CONTROLLERS
  // //////////////////////////////////////////////////////////

  GetCustomerByIdController: Symbol.for('GetCustomerByIdController'),
  GetAllCustomersController: Symbol.for('GetAllCustomersController'),
  CreateCustomerController: Symbol.for('CreateCustomerController'),
  UpdateCustomerController: Symbol.for('UpdateCustomerController'),
  DeleteCustomerByIdController: Symbol.for('DeleteCustomerByIdController'),
  AddAvailableCreditController: Symbol.for('AddAvailableCreditController'),
}
