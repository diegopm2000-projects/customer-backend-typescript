import 'reflect-metadata'

import { CustomerDTO } from '../../../../../../../../src/modules/main/customer/application/dtos/Customer.dto'
import { IGetCustomerByIdRequest, IGetCustomerByIdUseCase } from '../../../../../../../../src/modules/main/customer/application/usecases/GetCustomerById/IGetCustomerById.usecase'
import { CustomerMongoDBRepository } from '../../../../../../../../src/modules/main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { TYPES } from '../../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../../expectations/expectations.container'
import { DEFAULT_ADDRESS_PROPS } from '../../../domain/model/Address.test'
import { DEFAULT_CUSTOMER } from '../../../domain/model/Customer.test'
import { DEFAULT_EMAIL } from '../../../domain/model/Email.test'
import { DEFAULT_PHONE } from '../../../domain/model/Phone.test'

const DEFAULT_REQUEST: IGetCustomerByIdRequest = {
  customerId: DEFAULT_CUSTOMER.id.value(),
}

export const DEFAULT_GET_CUSTOMER_BY_ID_SVC_RESULT: CustomerDTO = {
  id: DEFAULT_CUSTOMER.id.value(),
  firstName: DEFAULT_CUSTOMER.firstName,
  lastName: DEFAULT_CUSTOMER.lastName,
  email: DEFAULT_EMAIL.value,
  phoneNumber: DEFAULT_PHONE.value,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS_PROPS,
  nifCif: '123456789Z',
}

describe('GetCustomerByIdUseCase - Tests', () => {
  let myService: IGetCustomerByIdUseCase
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myService = container.get<IGetCustomerByIdUseCase>(TYPES.IGetCustomerByIdUseCase)
  })
  describe('execute - Tests', () => {
    describe('execute - successfully case when customer was found', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(DEFAULT_CUSTOMER)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - successfully case when customer was found', async () => {
        // Arrange
        const request: IGetCustomerByIdRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toStrictEqual(DEFAULT_GET_CUSTOMER_BY_ID_SVC_RESULT)
      })
    })

    describe('execute - case when customer was NOT found', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(undefined)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - case when customer was NOT found', async () => {
        // Arrange
        const request: IGetCustomerByIdRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toBeUndefined()
      })
    })
  })
})
