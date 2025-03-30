import 'reflect-metadata'

import httpStatus from 'http-status'
import { mockRequest, mockResponse } from 'jest-mock-req-res'

import { DeleteCustomerByIdController } from '../../../../../../src/modules/main/customer/api/apirest/DeleteCustomerById.controller'
import { DeleteCustomerByIdUseCase } from '../../../../../../src/modules/main/customer/application/usecases/DeleteCustomerById/DeleteCustomerById.usecase'
import { TYPES } from '../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../expectations/expectations.container'
import { DEFAULT_ERROR_IN_TEST_MESSAGE, MESSAGE_TEST_FAILED } from '../../../../expectations/expectations.global'
import { DEFAULT_CUSTOMER } from '../../domain/model/Customer.test'

const DEFAULT_REQUEST = {
  params: {
    customerId: DEFAULT_CUSTOMER.id.value(),
  },
}

const BAD_PARAMETERS_REQUEST = {
  params: {
    customerId: 'bad-customer-id',
  },
}

describe('DeleteCustomerByIdController - Tests', () => {
  let myController: DeleteCustomerByIdController
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myController = container.get<DeleteCustomerByIdController>(TYPES.DeleteCustomerByIdController)
  })
  describe('DeleteCustomerByIdController - successfully cases', () => {
    describe('DeleteCustomerByIdController - default successfully case when customer has been found', () => {
      beforeEach(() => {
        jest.spyOn(DeleteCustomerByIdUseCase.prototype, 'execute').mockResolvedValue(true)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('DeleteCustomerByIdController - default successfully case when customer has been found', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          expect(response.status).toHaveBeenCalledWith(httpStatus.NO_CONTENT)
          expect(response.json).toHaveBeenCalledWith()
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })
  })

  describe('DeleteCustomerByIdController - failed cases', () => {
    describe('GetCustomerByIdController - failed case when bad parameters have been passed', () => {
      it('GetCustomerByIdController - failed case when bad parameters have been passed', async () => {
        // Arrange
        const request = mockRequest(BAD_PARAMETERS_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
          expect(response.json).toHaveBeenCalledWith()
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })

    describe('DeleteCustomerByIdController - failed case when customer has NOT been found', () => {
      beforeEach(() => {
        jest.spyOn(DeleteCustomerByIdUseCase.prototype, 'execute').mockResolvedValue(false)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('DeleteCustomerByIdController - failed case when customer has NOT been found', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          expect(response.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND)
          expect(response.json).toHaveBeenCalledWith()
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })

    describe('DeleteCustomerByIdController - failed case when service has failed', () => {
      beforeEach(() => {
        jest.spyOn(DeleteCustomerByIdUseCase.prototype, 'execute').mockRejectedValue(new Error(DEFAULT_ERROR_IN_TEST_MESSAGE))
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('DeleteCustomerByIdController - failed case when service has failed', async () => {
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
