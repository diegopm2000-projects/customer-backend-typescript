import 'reflect-metadata'

import httpStatus from 'http-status'
import { mockRequest, mockResponse } from 'jest-mock-req-res'

import { GetAllCustomersController } from '../../../../../../../src/modules/main/customer/api/apirest/GetAllCustomers.controller'
import { GetAllCustomersUseCase } from '../../../../../../../src/modules/main/customer/application/usecases/GetAllCustomers/GetAllCustomers.usecase'
import { TYPES } from '../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../expectations/expectations.container'
import { DEFAULT_ERROR_IN_TEST_MESSAGE, MESSAGE_TEST_FAILED } from '../../../../../expectations/expectations.global'
import { DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT } from '../../application/usecases/GetAllCustomers/GetAllCustomers.usecase.test'
import { DEFAULT_CUSTOMER } from '../../domain/model/Customer.test'

const DEFAULT_REQUEST = {
  params: {
    customerId: DEFAULT_CUSTOMER.id.value(),
  },
}

const DEFAULT_RESPONSE = DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT

describe('GetAllCustomersController - Tests', () => {
  let myController: GetAllCustomersController
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myController = container.get<GetAllCustomersController>(TYPES.GetAllCustomersController)
  })
  describe('GetAllCustomersController - successfully cases', () => {
    describe('GetAllCustomersController - default successfully case', () => {
      beforeEach(() => {
        jest.spyOn(GetAllCustomersUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('GetAllCustomersController - default successfully cases', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
          expect(response.json).toHaveBeenCalledWith(DEFAULT_RESPONSE)
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })
  })

  describe('GetAllCustomersController - failed cases', () => {
    describe('GetAllCustomersController - failed case when service has failed', () => {
      beforeEach(() => {
        jest.spyOn(GetAllCustomersUseCase.prototype, 'execute').mockRejectedValue(new Error(DEFAULT_ERROR_IN_TEST_MESSAGE))
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('GetAllCustomersController - failed case when service has failed', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          expect(response.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR)
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })
  })
})
