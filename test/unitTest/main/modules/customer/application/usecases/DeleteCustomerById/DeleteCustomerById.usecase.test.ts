import 'reflect-metadata'

import { IDeleteCustomerByIdRequest, IDeleteCustomerByIdUseCase } from '../../../../../../../../src/modules/main/customer/application/usecases/DeleteCustomerById/IDeleteCustomerById.usecase'
import { IGetCustomerByIdRequest } from '../../../../../../../../src/modules/main/customer/application/usecases/GetCustomerById/IGetCustomerById.usecase'
import { CustomerMongoDBRepository } from '../../../../../../../../src/modules/main/customer/infrastructure/persistence/mongodb/Customer.mongodb.repository'
import { TYPES } from '../../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../../expectations/expectations.container'
import { DEFAULT_CUSTOMER } from '../../../domain/model/Customer.test'

const DEFAULT_REQUEST: IDeleteCustomerByIdRequest = {
  customerId: DEFAULT_CUSTOMER.id.value(),
}

describe('DeleteCustomerByIdUseCase - Tests', () => {
  let myService: IDeleteCustomerByIdUseCase
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myService = container.get<IDeleteCustomerByIdUseCase>(TYPES.IDeleteCustomerByIdUseCase)
  })
  describe('execute - Tests', () => {
    describe('execute - successfully case when customer was found', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'deleteById').mockResolvedValue(true)
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
        expect(result).toBeTruthy()
      })
    })

    describe('execute - case when customer was NOT found', () => {
      beforeEach(() => {
        jest.spyOn(CustomerMongoDBRepository.prototype, 'deleteById').mockResolvedValue(false)
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
        expect(result).toBeFalsy()
      })
    })
  })
})
