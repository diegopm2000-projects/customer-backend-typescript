/* eslint-disable sonarjs/no-duplicate-string */

import 'reflect-metadata'

import httpStatus from 'http-status'
import { mockRequest, mockResponse } from 'jest-mock-req-res'
import { ID } from 'types-ddd'

import { BAD_REQUEST_ERROR, OBJECT_NOT_FOUND_ERROR } from '../../../../../../../src/modules/main/customer/api/apirest/shared/BasePresenter'
import { UpdateCustomerController } from '../../../../../../../src/modules/main/customer/api/apirest/UpdateCustomer.controller'
import { BadParametersInCustomerUpdateError } from '../../../../../../../src/modules/main/customer/application/errors/BadParametersInCustomerUpdateError copy'
import { CustomerNotFoundError } from '../../../../../../../src/modules/main/customer/application/errors/CustomerNotFoundError'
import { UpdateCustomerUseCase } from '../../../../../../../src/modules/main/customer/application/usecases/UpdateCustomer/UpdateCustomer.usecase'
import { TYPES } from '../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../expectations/expectations.container'
import { DEFAULT_ERROR_IN_TEST_MESSAGE, MESSAGE_TEST_FAILED } from '../../../../../expectations/expectations.global'
import { DEFAULT_UPDATE_CUSTOMER_SVC_RESULT } from '../../application/usecases/UpdateCustomer/UpdateCustomer.usecase.test'
import { DEFAULT_ADDRESS, DEFAULT_ADDRESS_PROPS } from '../../domain/model/Address.test'
import { DEFAULT_EMAIL } from '../../domain/model/Email.test'
import { DEFAULT_PHONE } from '../../domain/model/Phone.test'

const DEFAULT_REQUEST = {
  body: {
    id: 'fcf95384-aee8-4dec-ab2a-7836c3b826f9',
    firstName: 'firstName',
    lastName: 'lastName',
    email: DEFAULT_EMAIL.value,
    phoneNumber: DEFAULT_PHONE.value,
    dateOfBirth: '1992-01-01T00:00:00.000Z',
    address: DEFAULT_ADDRESS_PROPS,
    nifCif: '123456789Z',
  },
}

const BAD_PARAMETERS_REQUEST = {
  body: {},
}

const DEFAULT_RESPONSE = DEFAULT_UPDATE_CUSTOMER_SVC_RESULT

describe('UpdateCustomerController - Tests', () => {
  let myController: UpdateCustomerController
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myController = container.get<UpdateCustomerController>(TYPES.UpdateCustomerController)
  })
  describe('UpdateCustomerController - successfully cases', () => {
    describe('UpdateCustomerController - default successfully case', () => {
      beforeEach(() => {
        jest.spyOn(UpdateCustomerUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_UPDATE_CUSTOMER_SVC_RESULT)
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('UpdateCustomerController - default successfully cases', async () => {
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

    describe('UpdateCustomerController - case when customer was NOT found', () => {
      beforeEach(() => {
        jest.spyOn(UpdateCustomerUseCase.prototype, 'execute').mockResolvedValue(new CustomerNotFoundError(ID.create('fcf95384-aee8-4dec-ab2a-7836c3b826f9')))
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

  describe('UpdateCustomerController - failed cases', () => {
    describe('UpdateCustomerController - failed case when bad parameters have been passed', () => {
      it('UpdateCustomerController - failed case when bad parameters have been passed', async () => {
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

    describe('UpdateCustomer - failed case when svc returned that bad parameters have been passed', () => {
      beforeEach(() => {
        jest.spyOn(UpdateCustomerUseCase.prototype, 'execute').mockResolvedValue(
          new BadParametersInCustomerUpdateError({
            id: ID.create('fcf95384-aee8-4dec-ab2a-7836c3b826f9'),
            firstName: 'firstName',
            lastName: 'lastName',
            email: DEFAULT_EMAIL,
            phoneNumber: DEFAULT_PHONE,
            dateOfBirth: new Date('1990-01-01'),
            address: DEFAULT_ADDRESS,
            nifCif: 'nonsense',
          })
        )
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('UpdateCustomer - failed case when svc returned that bad parameters have been passed', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
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

    describe('UpdateCustomer - failed case when service has failed', () => {
      beforeEach(() => {
        jest.spyOn(UpdateCustomerUseCase.prototype, 'execute').mockRejectedValue(new Error(DEFAULT_ERROR_IN_TEST_MESSAGE))
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('UpdateCustomer - failed case when service has failed', async () => {
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
