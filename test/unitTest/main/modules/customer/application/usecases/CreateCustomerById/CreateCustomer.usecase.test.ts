import 'reflect-metadata'

import { Fail, ID } from 'types-ddd'

import { ICreateCustomerRequest, ICreateCustomerUseCase } from '../../../../../../../../src/modules/main/customer/application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { TYPES } from '../../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../../expectations/expectations.container'
import { DEFAULT_ADDRESS, DEFAULT_ADDRESS_PROPS } from '../../../domain/model/Address.test'
import { DEFAULT_EMAIL } from '../../../domain/model/Email.test'
import { DEFAULT_PHONE } from '../../../domain/model/Phone.test'
import { CustomerDTO } from '../../../../../../../../src/modules/main/customer/application/dtos/Customer.dto'
import { CustomerMongoDBRepository } from '../../../../../../../../src/modules/main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { DEFAULT_CUSTOMER } from '../../../domain/model/Customer.test'
import { CustomerAlreadyExistsError } from '../../../../../../../../src/modules/main/customer/application/errors/CustomerAlreadyExistsError'
import { Customer } from '../../../../../../../../src/modules/main/customer/domain/models/Customer'
import { BadParametersInCustomerCreationError } from '../../../../../../../../src/modules/main/customer/application/errors/BadParametersInCustomerCreationError'

const DEFAULT_REQUEST: ICreateCustomerRequest = {
  id: ID.create('fcf95384-aee8-4dec-ab2a-7836c3b826f9'),
  firstName: 'firstName',
  lastName: 'lastName',
  email: DEFAULT_EMAIL,
  phoneNumber: DEFAULT_PHONE,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS,
  nifCif: '123456789Z',
}

export const DEFAULT_CREATE_CUSTOMER_SVC_RESULT: CustomerDTO = {
  id: 'fcf95384-aee8-4dec-ab2a-7836c3b826f9',
  firstName: 'firstName',
  lastName: 'lastName',
  email: DEFAULT_EMAIL.value,
  phoneNumber: DEFAULT_PHONE.value,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS_PROPS,
  nifCif: '123456789Z',
}

describe('CreateCustomerUseCase - Tests', () => {
  let myService: ICreateCustomerUseCase
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myService = container.get<ICreateCustomerUseCase>(TYPES.ICreateCustomerUseCase)
  })
  describe('execute - Tests', () => {
    describe('execute - default successfully case', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(undefined)
        jest.spyOn(CustomerMongoDBRepository.prototype, 'save').mockResolvedValue(true)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - default successfully case', async () => {
        // Arrange
        const request: ICreateCustomerRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toStrictEqual(DEFAULT_CREATE_CUSTOMER_SVC_RESULT)
      })
    })

    describe('execute - failed case when request has bad parameters', () => {
      beforeEach(() => {
        jest.spyOn(Customer, 'create').mockReturnValue(Fail('Bad parameters'))
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - failed case when request has bad parameters', async () => {
        // Arrange
        const request: ICreateCustomerRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toBeInstanceOf(BadParametersInCustomerCreationError)
      })
    })

    describe('execute - failed case when customer has been found in the system', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(DEFAULT_CUSTOMER)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - failed case when customer has been found in the system', async () => {
        // Arrange
        const request: ICreateCustomerRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toBeInstanceOf(CustomerAlreadyExistsError)
      })
    })
  })
})
