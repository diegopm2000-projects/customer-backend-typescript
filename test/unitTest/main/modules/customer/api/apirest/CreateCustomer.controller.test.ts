/* eslint-disable sonarjs/no-duplicate-string */

import 'reflect-metadata'

import httpStatus from 'http-status'
import { mockRequest, mockResponse } from 'jest-mock-req-res'
import { ID } from 'types-ddd'

import { CreateCustomerController } from '../../../../../../../src/modules/main/customer/api/apirest/CreateCustomer.controller'
import { BAD_REQUEST_ERROR, CONFLICT_ERROR } from '../../../../../../../src/modules/main/customer/api/apirest/shared/BasePresenter'
import { BadParametersInCustomerCreationError } from '../../../../../../../src/modules/main/customer/application/errors/BadParametersInCustomerCreationError'
import { CustomerAlreadyExistsError } from '../../../../../../../src/modules/main/customer/application/errors/CustomerAlreadyExistsError'
import { CreateCustomerUseCase } from '../../../../../../../src/modules/main/customer/application/usecases/CreateCustomer/CreateCustomer.usecase'
import { TYPES } from '../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../expectations/expectations.container'
import { DEFAULT_ERROR_IN_TEST_MESSAGE, MESSAGE_TEST_FAILED } from '../../../../../expectations/expectations.global'
import { DEFAULT_CREATE_CUSTOMER_SVC_RESULT } from '../../application/usecases/CreateCustomerById/CreateCustomer.usecase.test'
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

const DEFAULT_RESPONSE = DEFAULT_CREATE_CUSTOMER_SVC_RESULT

describe('CreateCustomerController - Tests', () => {
  let myController: CreateCustomerController
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myController = container.get<CreateCustomerController>(TYPES.CreateCustomerController)
  })
  describe('CreateCustomerController - successfully cases', () => {
    describe('CreateCustomerController - default successfully case', () => {
      beforeEach(() => {
        jest.spyOn(CreateCustomerUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_CREATE_CUSTOMER_SVC_RESULT)
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
          expect(response.status).toHaveBeenCalledWith(httpStatus.CREATED)
          expect(response.json).toHaveBeenCalledWith(DEFAULT_RESPONSE)
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
    })

    describe('CreateCustomerController - case when customer was already found', () => {
      beforeEach(() => {
        jest.spyOn(CreateCustomerUseCase.prototype, 'execute').mockResolvedValue(new CustomerAlreadyExistsError(ID.create('fcf95384-aee8-4dec-ab2a-7836c3b826f9')))
      })
      afterEach(() => {
        jest.restoreAllMocks()
      })
      it('CreateCustomerController - case when customer was already found', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
        const response = mockResponse()
        try {
          // Act
          await myController.execute(request, response)
          // Assert
          expect(response.status).toHaveBeenCalledWith(httpStatus.CONFLICT)
          expect(response.json).toHaveBeenCalledWith(
            expect.objectContaining({
              status: httpStatus.CONFLICT,
              error: CONFLICT_ERROR,
            })
          )
        } catch {
          fail(MESSAGE_TEST_FAILED)
        }
      })
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

    describe('CreateCustomerController - failed case when svc returned that bad parameters have been passed', () => {
      beforeEach(() => {
        jest.spyOn(CreateCustomerUseCase.prototype, 'execute').mockResolvedValue(
          new BadParametersInCustomerCreationError({
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
      it('CreateCustomerController - failed case when svc returned that bad parameters have been passed', async () => {
        // Arrange
        const request = mockRequest(DEFAULT_REQUEST)
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

    describe('CreateCustomer - failed case when service has failed', () => {
      beforeEach(() => {
        jest.spyOn(CreateCustomerUseCase.prototype, 'execute').mockRejectedValue(new Error(DEFAULT_ERROR_IN_TEST_MESSAGE))
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
