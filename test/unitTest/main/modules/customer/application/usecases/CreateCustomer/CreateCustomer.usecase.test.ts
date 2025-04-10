import 'reflect-metadata'

import { Fail, ID } from 'types-ddd'

import { CustomerDTO } from '../../../../../../../../src/modules/main/customer/application/dtos/Customer.dto'
import { BadParametersInCustomerCreationError } from '../../../../../../../../src/modules/main/customer/application/errors/BadParametersInCustomerCreationError'
import { CustomerAlreadyExistsByIDError } from '../../../../../../../../src/modules/main/customer/application/errors/CustomerAlreadyExistsByIDError'
import { ICreateCustomerRequest, ICreateCustomerUseCase } from '../../../../../../../../src/modules/main/customer/application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { Customer } from '../../../../../../../../src/modules/main/customer/domain/models/Customer'
import { CustomerMongoDBRepository } from '../../../../../../../../src/modules/main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { TYPES } from '../../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../../expectations/expectations.container'
import { DEFAULT_CUSTOMER } from '../../../domain/model/Customer.test'
import { DEFAULT_ADDRESS, DEFAULT_ADDRESS_PROPS } from '../../../domain/model/value-objects/Address.test'
import { DEFAULT_EMAIL } from '../../../domain/model/value-objects/Email.test'
import { DEFAULT_PHONE } from '../../../domain/model/value-objects/Phone.test'
import { DEFAULT_NIFCIFNIE } from '../../../domain/model/value-objects/SpainID.test'
import { CustomerAlreadyExistsByDNINIFCIFError } from '../../../../../../../../src/modules/main/customer/application/errors/CustomerAlreadyExistsByNIFCIFNIEError'

const DEFAULT_REQUEST: ICreateCustomerRequest = {
  id: ID.create('706781a2-e4ee-4fc5-ab0f-fdf92f643c8a'),
  firstName: 'John',
  lastName: 'Doe',
  email: DEFAULT_EMAIL,
  phoneNumber: DEFAULT_PHONE,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS,
  nifCifNie: DEFAULT_NIFCIFNIE,
}

export const DEFAULT_CREATE_CUSTOMER_SVC_RESULT: CustomerDTO = {
  id: '706781a2-e4ee-4fc5-ab0f-fdf92f643c8a',
  firstName: 'John',
  lastName: 'Doe',
  email: DEFAULT_EMAIL.value,
  phoneNumber: DEFAULT_PHONE.value,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS_PROPS,
  nifCifNie: DEFAULT_NIFCIFNIE.value,
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
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getByNIFCIFNIE').mockResolvedValue(undefined)
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

    describe('execute - failed case when customer has been found by ID in the system', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(DEFAULT_CUSTOMER)
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getByNIFCIFNIE').mockResolvedValue(undefined)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - failed case when customer has been found by ID in the system', async () => {
        // Arrange
        const request: ICreateCustomerRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toBeInstanceOf(CustomerAlreadyExistsByIDError)
      })
    })

    describe('execute - failed case when customer has been found by NIFCIFNIE in the system', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(undefined)
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getByNIFCIFNIE').mockResolvedValue(DEFAULT_CUSTOMER)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - failed case when customer has been found by NIFCIFNIE in the system', async () => {
        // Arrange
        const request: ICreateCustomerRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toBeInstanceOf(CustomerAlreadyExistsByDNINIFCIFError)
      })
    })
  })
})
