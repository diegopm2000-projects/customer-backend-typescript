/* eslint-disable sonarjs/no-duplicate-string */

import 'reflect-metadata'

import httpStatus from 'http-status'
import { mockRequest, mockResponse } from 'jest-mock-req-res'

import { DEFAULT_ADD_AVAILABLE_CREDIT_SVC_RESULT } from '../../application/usecases/AddAvailableCredit/AddAvailableCredit.usecase.test'
import { AddAvailableCreditController } from '../../../../../../../src/modules/main/customer/api/apirest/AddAvailableCredit.controller'
import { ContainerFactory } from '../../../../../expectations/expectations.container'
import { TYPES } from '../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { AddAvailableCreditUseCase } from '../../../../../../../src/modules/main/customer/application/usecases/AddAvailableCredit/AddAvailableCredit.usecase'
import { DEFAULT_CUSTOMER } from '../../domain/model/Customer.test'
import { DEFAULT_ERROR_IN_TEST_MESSAGE, MESSAGE_TEST_FAILED } from '../../../../../expectations/expectations.global'
import { CustomerNotFoundError } from '../../../../../../../src/modules/main/customer/application/errors/CustomerNotFoundError'
import { ID } from 'types-ddd'
import { BAD_REQUEST_ERROR, OBJECT_NOT_FOUND_ERROR } from '../../../../../../../src/modules/main/customer/api/apirest/shared/BasePresenter'

const DEFAULT_REQUEST = {
  params: {
    customerId: DEFAULT_CUSTOMER.id.value(),
  },
  body: {
    amount: 100,
  },
}

const BAD_PARAMETERS_REQUEST = {
  body: {},
}

const DEFAULT_RESPONSE = DEFAULT_ADD_AVAILABLE_CREDIT_SVC_RESULT

describe('AddAvailableCreditController - Tests', () => {
  let myController: AddAvailableCreditController
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myController = container.get<AddAvailableCreditController>(TYPES.AddAvailableCreditController)
  })

  describe('AddAvailableCreditController - successfully cases', () => {
    describe('AddAvailableCreditController - default successfully case', () => {
      beforeEach(() => {
        jest.spyOn(AddAvailableCreditUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_ADD_AVAILABLE_CREDIT_SVC_RESULT)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('CreateCustomerController - default successfully cases', async () => {
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

    describe('CreateCustomerController - failed cases', () => {
      describe('CreateCustomerController - failed case when bad parameters have been passed', () => {
        it('CreateCustomerController - failed case when bad parameters have been passed', async () => {
          // Arrange
          const request = mockRequest(BAD_PARAMETERS_REQUEST)
          const response = mockResponse()
          try {
            // Act
            await myController.execute(request, response)
            // Assert
            expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
            expect(response.json).toHaveBeenCalledWith(
              expect.objectContaining({
                status: httpStatus.BAD_REQUEST,
                error: BAD_REQUEST_ERROR,
              })
            )
          } catch {
            fail(MESSAGE_TEST_FAILED)
          }
        })
      })

      describe('UpdateCustomerController - case when customer was NOT found', () => {
        beforeEach(() => {
          jest.spyOn(AddAvailableCreditUseCase.prototype, 'execute').mockResolvedValue(new CustomerNotFoundError(ID.create('fcf95384-aee8-4dec-ab2a-7836c3b826f9')))
        })
        afterEach(() => {
          jest.restoreAllMocks()
        })
        it('UpdateCustomerController - case when customer was NOT found', async () => {
          // Arrange
          const request = mockRequest(DEFAULT_REQUEST)
          const response = mockResponse()
          try {
            // Act
            await myController.execute(request, response)
            // Assert
            expect(response.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND)
            expect(response.json).toHaveBeenCalledWith(
              expect.objectContaining({
                status: httpStatus.NOT_FOUND,
                error: OBJECT_NOT_FOUND_ERROR,
              })
            )
          } catch {
            fail(MESSAGE_TEST_FAILED)
          }
        })
      })

      describe('CreateCustomer - failed case when service has failed', () => {
        beforeEach(() => {
          jest.spyOn(AddAvailableCreditUseCase.prototype, 'execute').mockRejectedValue(new Error(DEFAULT_ERROR_IN_TEST_MESSAGE))
        })
        afterEach(() => {
          jest.restoreAllMocks()
        })
        it('CreateCustomer - failed case when service has failed', async () => {
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
})
