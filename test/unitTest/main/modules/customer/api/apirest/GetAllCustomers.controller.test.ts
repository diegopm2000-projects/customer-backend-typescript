/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'

import httpStatus from 'http-status'
import { mockRequest, mockResponse } from 'jest-mock-req-res'

import { GetAllCustomersController } from '../../../../../../../src/modules/main/customer/api/apirest/GetAllCustomers.controller'
import { BAD_REQUEST_ERROR } from '../../../../../../../src/modules/main/customer/api/apirest/shared/BasePresenter'
import { GetAllCustomersUseCase } from '../../../../../../../src/modules/main/customer/application/usecases/GetAllCustomers/GetAllCustomers.usecase'
import { TYPES } from '../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../expectations/expectations.container'
import { DEFAULT_ERROR_IN_TEST_MESSAGE, MESSAGE_TEST_FAILED } from '../../../../../expectations/expectations.global'
import { DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT } from '../../application/usecases/GetAllCustomers/GetAllCustomers.usecase.test'

const DEFAULT_REQUEST = {
  query: {},
}

const ALT_REQUEST = {
  query: {
    sort: 'availableCredit',
    order: 'asc',
  },
}

const BAD_PARAMETERS_REQUEST = {
  query: {
    sort: 'availableCredit',
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

    describe('GetAllCustomersController - alt successfully case passing sort & order', () => {
      beforeEach(() => {
        jest.spyOn(GetAllCustomersUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('GetAllCustomersController - alt successfully case passing sort & order', async () => {
        // Arrange
        const request = mockRequest(ALT_REQUEST)
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
    describe('CreateCustomerController - failed case when bad parameters have been passed', () => {
      it('CreateCustomerController - failed case when bad parameters have been passed', async () => {
        // Arrange
        const request = mockRequest(BAD_PARAMETERS_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          // expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
          expect(response.json).toHaveBeenCalledWith(
            expect.objectContaining({
              status: httpStatus.BAD_REQUEST,
              error: BAD_REQUEST_ERROR,
            })
          )
        } catch (error: any) {
          console.error(`---> ESTE error que es: ${error.stack}`)
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })

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
