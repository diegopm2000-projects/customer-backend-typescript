import 'reflect-metadata'

import httpStatus from 'http-status'
import { mockRequest, mockResponse } from 'jest-mock-req-res'

import { GetCustomerByIdController } from '../../../../../../../src/modules/main/customer/api/apirest/GetCustomerById.controller'
import { GetCustomerByIdUseCase } from '../../../../../../../src/modules/main/customer/application/usecases/GetCustomerById/GetCustomerById.usecase'
import { TYPES } from '../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../expectations/expectations.container'
import { DEFAULT_ERROR_IN_TEST_MESSAGE, MESSAGE_TEST_FAILED } from '../../../../../expectations/expectations.global'
import { DEFAULT_GET_CUSTOMER_BY_ID_SVC_RESULT } from '../../application/usecases/GetCustomerById/GetCustomerById.test'
import { DEFAULT_CUSTOMER } from '../../domain/model/Customer.test'
import { BAD_REQUEST_ERROR, INTERNAL_SERVER_ERROR, OBJECT_NOT_FOUND_ERROR } from '../../../../../../../src/modules/main/customer/api/apirest/shared/PresentationErrors'

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

const DEFAULT_RESPONSE = DEFAULT_GET_CUSTOMER_BY_ID_SVC_RESULT

describe('GetCustomerByIdController - Tests', () => {
  let myController: GetCustomerByIdController
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myController = container.get<GetCustomerByIdController>(TYPES.GetCustomerByIdController)
  })
  describe('GetCustomerByIdController - successfully cases', () => {
    describe('GetCustomerByIdController - default successfully case', () => {
      beforeEach(() => {
        jest.spyOn(GetCustomerByIdUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_GET_CUSTOMER_BY_ID_SVC_RESULT)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('GetCustomerByIdController - default successfully cases', async () => {
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

    describe('GetCustomerByIdController - case when customer was not found', () => {
      beforeEach(() => {
        jest.spyOn(GetCustomerByIdUseCase.prototype, 'execute').mockResolvedValue(undefined)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('GetCustomerByIdController - case when customer was not found', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          expect(response.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND)
          expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
            status: httpStatus.NOT_FOUND,
            error: OBJECT_NOT_FOUND_ERROR,
          }))
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })
  })

  describe('GetCustomerByIdController - failed cases', () => {
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
          expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
            status: httpStatus.BAD_REQUEST,
            error: BAD_REQUEST_ERROR,
          }))
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })

    describe('GetCustomerByIdController - failed case when service has failed', () => {
      beforeEach(() => {
        jest.spyOn(GetCustomerByIdUseCase.prototype, 'execute').mockRejectedValue(new Error(DEFAULT_ERROR_IN_TEST_MESSAGE))
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('GetCustomerByIdController - failed case when service has failed', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            error: INTERNAL_SERVER_ERROR,
          }))
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })
  })
})
