import 'reflect-metadata'

import { CustomerDTO } from '../../../../../../../../src/modules/main/customer/application/dtos/Customer.dto'
import { CustomerNotFoundError } from '../../../../../../../../src/modules/main/customer/application/errors/CustomerNotFoundError'
import { IAddAvailableCreditRequest, IAddAvailableCreditUseCase } from '../../../../../../../../src/modules/main/customer/application/usecases/AddAvailableCredit/IAddAvailableCredit.usecase'
import { AvailableCredit } from '../../../../../../../../src/modules/main/customer/domain/models/value-objects/AvailableCredit'
import { CustomerMongoDBRepository } from '../../../../../../../../src/modules/main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { TYPES } from '../../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../../expectations/expectations.container'
import { DEFAULT_CUSTOMER } from '../../../domain/model/Customer.test'
import { DEFAULT_ADDRESS_PROPS } from '../../../domain/model/value-objects/Address.test'
import { DEFAULT_EMAIL } from '../../../domain/model/value-objects/Email.test'
import { DEFAULT_PHONE } from '../../../domain/model/value-objects/Phone.test'
import { DEFAULT_NIFCIFNIE } from '../../../domain/model/value-objects/SpainID.test'

const DEFAULT_REQUEST: IAddAvailableCreditRequest = {
  customerId: '706781a2-e4ee-4fc5-ab0f-fdf92f643c8a',
  availableCredit: AvailableCredit.create({ value: 10000 }).value(),
}

export const DEFAULT_ADD_AVAILABLE_CREDIT_SVC_RESULT: CustomerDTO = {
  id: '706781a2-e4ee-4fc5-ab0f-fdf92f643c8a',
  firstName: 'John',
  lastName: 'Doe',
  email: DEFAULT_EMAIL.value,
  phoneNumber: DEFAULT_PHONE.value,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS_PROPS,
  nifCifNie: DEFAULT_NIFCIFNIE.value,
  availableCredit: 20000,
}

describe('AddAvailableCreditUseCase - Tests', () => {
  let myService: IAddAvailableCreditUseCase
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myService = container.get<IAddAvailableCreditUseCase>(TYPES.IAddAvailableCreditUseCase)
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
        const request: IAddAvailableCreditRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toStrictEqual(DEFAULT_ADD_AVAILABLE_CREDIT_SVC_RESULT)
      })
    })

    describe('execute - failed case when customer was not found', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'getById').mockResolvedValue(undefined)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('execute - failed case when customer was not found', async () => {
        // Arrange
        const request: IAddAvailableCreditRequest = DEFAULT_REQUEST
        // Act
        const result = await myService.execute(request)
        // Assert
        expect(result).toBeInstanceOf(CustomerNotFoundError)
      })
    })
  })
})
