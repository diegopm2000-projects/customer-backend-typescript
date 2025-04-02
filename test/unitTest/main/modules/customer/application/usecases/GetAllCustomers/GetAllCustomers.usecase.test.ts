import 'reflect-metadata'

import { IGetAllCustomersRequest, IGetAllCustomersUseCase } from '../../../../../../../../src/modules/main/customer/application/usecases/GetAllCustomers/IGetAllCustomers.usecase'
import { CustomerMongoDBRepository } from '../../../../../../../../src/modules/main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { TYPES } from '../../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../../expectations/expectations.container'
import { DEFAULT_CUSTOMER } from '../../../domain/model/Customer.test'
import { DEFAULT_ADDRESS_PROPS } from '../../../domain/model/value-objects/Address.test'
import { DEFAULT_EMAIL } from '../../../domain/model/value-objects/Email.test'
import { DEFAULT_PHONE } from '../../../domain/model/value-objects/Phone.test'
import { DEFAULT_NIFCIFNIE } from '../../../domain/model/value-objects/SpainID.test'

export const DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT = [
  {
    id: DEFAULT_CUSTOMER.id.value(),
    firstName: DEFAULT_CUSTOMER.firstName,
    lastName: DEFAULT_CUSTOMER.lastName,
    email: DEFAULT_EMAIL.value,
    phoneNumber: DEFAULT_PHONE.value,
    dateOfBirth: new Date('1990-01-01'),
    address: DEFAULT_ADDRESS_PROPS,
    nifCifNie: DEFAULT_NIFCIFNIE.value,
  },
]

describe('GetAllCustomersUseCase - Tests', () => {
  let myService: IGetAllCustomersUseCase
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myService = container.get<IGetAllCustomersUseCase>(TYPES.IGetAllCustomersUseCase)
  })
  describe('execute - Tests', () => {
    describe('execute - successfully case when customer was found', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getAll').mockResolvedValue([DEFAULT_CUSTOMER])
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - successfully case when customer was found', async () => {
        // Arrange
        const request: IGetAllCustomersRequest = {}
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toStrictEqual(DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT)
      })
    })
  })
})
