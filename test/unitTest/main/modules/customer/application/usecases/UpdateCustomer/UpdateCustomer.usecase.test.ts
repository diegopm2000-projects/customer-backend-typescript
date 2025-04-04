import 'reflect-metadata'

import { Fail, ID } from 'types-ddd'

import { CustomerDTO } from '../../../../../../../../src/modules/main/customer/application/dtos/Customer.dto'
import { BadParametersInCustomerUpdateError } from '../../../../../../../../src/modules/main/customer/application/errors/BadParametersInCustomerUpdateError copy'
import { CustomerNotFoundError } from '../../../../../../../../src/modules/main/customer/application/errors/CustomerNotFoundError'
import { ICreateCustomerRequest } from '../../../../../../../../src/modules/main/customer/application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { IUpdateCustomerRequest, IUpdateCustomerUseCase } from '../../../../../../../../src/modules/main/customer/application/usecases/UpdateCustomer/IUpdateCustomer.usecase'
import { Customer } from '../../../../../../../../src/modules/main/customer/domain/models/Customer'
import { CustomerMongoDBRepository } from '../../../../../../../../src/modules/main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { TYPES } from '../../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../../expectations/expectations.container'
import { DEFAULT_CUSTOMER } from '../../../domain/model/Customer.test'
import { DEFAULT_ADDRESS, DEFAULT_ADDRESS_PROPS } from '../../../domain/model/value-objects/Address.test'
import { DEFAULT_EMAIL } from '../../../domain/model/value-objects/Email.test'
import { DEFAULT_PHONE } from '../../../domain/model/value-objects/Phone.test'
import { DEFAULT_NIFCIFNIE } from '../../../domain/model/value-objects/SpainID.test'
import { DEFAULT_AVAILABLE_CREDIT } from '../../../domain/model/value-objects/AvailableCredit.test'

const DEFAULT_REQUEST: IUpdateCustomerRequest = {
  id: ID.create('706781a2-e4ee-4fc5-ab0f-fdf92f643c8a'),
  firstName: 'John',
  lastName: 'Doe',
  email: DEFAULT_EMAIL,
  phoneNumber: DEFAULT_PHONE,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS,
  nifCifNie: DEFAULT_NIFCIFNIE,
}

export const DEFAULT_UPDATE_CUSTOMER_SVC_RESULT: CustomerDTO = {
  id: '706781a2-e4ee-4fc5-ab0f-fdf92f643c8a',
  firstName: 'John',
  lastName: 'Doe',
  email: DEFAULT_EMAIL.value,
  phoneNumber: DEFAULT_PHONE.value,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS_PROPS,
  nifCifNie: DEFAULT_NIFCIFNIE.value,
  availableCredit: DEFAULT_AVAILABLE_CREDIT.value,
}

describe('UpdateCustomerUseCase - Tests', () => {
  let myService: IUpdateCustomerUseCase
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myService = container.get<IUpdateCustomerUseCase>(TYPES.IUpdateCustomerUseCase)
  })
  describe('execute - Tests', () => {
    describe('execute - default successfully case', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(DEFAULT_CUSTOMER)
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
        expect(result).toStrictEqual(DEFAULT_UPDATE_CUSTOMER_SVC_RESULT)
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
        expect(result).toBeInstanceOf(BadParametersInCustomerUpdateError)
      })
    })

    describe('execute - failed case when customer has NOT been found in the system', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(undefined)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - failed case when customer has NOT been found in the system', async () => {
        // Arrange
        const request: ICreateCustomerRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toBeInstanceOf(CustomerNotFoundError)
      })
    })
  })
})
