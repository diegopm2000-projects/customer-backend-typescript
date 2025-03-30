import superagent from 'superagent'

import { IAppConfig } from '../../../../src/app/IAppConfig'

import { GetAllCustomersUseCase } from '../../../../src/modules/main/customer/application/usecases/GetAllCustomers/GetAllCustomers.usecase'
import { MESSAGE_TEST_FAILED } from '../../expectations/expectations.global'
import { DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT } from '../modules/customer/application/usecases/GetAllCustomers/GetAllCustomers.usecase.test'

// SUT
import { App } from '../../../../src/app/app'
import { DEFAULT_GET_CUSTOMER_BY_ID_SVC_RESULT } from '../modules/customer/application/usecases/GetCustomerById/GetCustomerById.test'
import { GetCustomerByIdUseCase } from '../../../../src/modules/main/customer/application/usecases/GetCustomerById/GetCustomerById.usecase'
import { CreateCustomerUseCase } from '../../../../src/modules/main/customer/application/usecases/CreateCustomer/CreateCustomer.usecase'
import { DEFAULT_CREATE_CUSTOMER_SVC_RESULT } from '../modules/customer/application/usecases/CreateCustomerById/CreateCustomer.usecase.test'
import { DEFAULT_UPDATE_CUSTOMER_SVC_RESULT } from '../modules/customer/application/usecases/UpdateCustomer/UpdateCustomer.usecase.test'
import { UpdateCustomerUseCase } from '../../../../src/modules/main/customer/application/usecases/UpdateCustomer/UpdateCustomer.usecase'
import { DeleteCustomerByIdUseCase } from '../../../../src/modules/main/customer/application/usecases/DeleteCustomerById/DeleteCustomerById.usecase'

const DEFAULT_CONFIG: IAppConfig = {
  mongodburi: 'mongodb://localhost:27017',
  expressPort: 3000,
}

const DEFAULT_CUSTOMER_BODY_RESPONSE = {
  id: '706781a2-e4ee-4fc5-ab0f-fdf92f643c8a',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@mail.com',
  phoneNumber: '+34 666666666',
  dateOfBirth: '1990-01-01T00:00:00.000Z',
  address: { street: 'myStreet', number: 123, city: 'myCity', state: 'myState', postalCode: '123456', country: 'myCountry', additionalInfo: 'myAdditionalInfo' },
  nifCif: '123456789Z',
}

const DEFAULT_CUSTOMER_BODY_REQUEST = DEFAULT_CUSTOMER_BODY_RESPONSE

describe('App - Tests', () => {
  describe('constructor - Tests', () => {
    it('constructor - default successfully case', () => {
      // Arrange
      const appConfig: IAppConfig = DEFAULT_CONFIG
      // Act
      const myApp = new App(appConfig)
      // Assert
      expect(myApp).toBeDefined()
    })
  })
  describe('start & stop- Tests', () => {
    describe('start & stop - default successful case', () => {
      it('start - default successful case', async () => {
        // Arrange
        const myApp = new App(DEFAULT_CONFIG)
        // Act
        const result = await myApp.start()
        // Assert
        expect(result).toBeTruthy()
        // Stop the server after starting
        await myApp.stop()
      })
    })
    describe('getContainer - Tests', () => {
      it('getContainer - default successful case', async () => {
        // Arrange
        const myApp = new App(DEFAULT_CONFIG)
        // Act
        const result = await myApp.start()
        // Assert
        expect(result).toBeTruthy()
        const container = myApp.container
        expect(container).toBeDefined()
        // Stop the server after starting
        await myApp.stop()
      })
      it('getContainer - failed case when container is not initialized', async () => {
        // Arrange
        const myApp = new App(DEFAULT_CONFIG)
        try {
          // Act
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const container = myApp.container
          fail(MESSAGE_TEST_FAILED)
        } catch (error) {
          // Assert
          expect(error).toBeDefined()
          expect((error as Error).message).toBe('Container not initialized')
        }
        // Stop the server after starting
        await myApp.stop()
      })
    })

    describe('ApiRest - Tests', () => {
      describe('GetCustomerByIdController - successfully case', () => {
        let fnService: jest.SpyInstance
        beforeEach(() => {
          fnService = jest.spyOn(GetCustomerByIdUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_GET_CUSTOMER_BY_ID_SVC_RESULT)
        })
        afterEach(() => {
          jest.restoreAllMocks()
        })
        it('GetCustomerByIdController - successfully case', async () => {
          // Arrange
          const myApp = new App(DEFAULT_CONFIG)
          // Act
          await myApp.start()
          const endpointPath = `http://localhost:${DEFAULT_CONFIG.expressPort}/api/customers/706781a2-e4ee-4fc5-ab0f-fdf92f643c8a`
          const res = await superagent.get(endpointPath)
          console.log(`---> ${JSON.stringify(res.body)}`)
          // Assert
          expect(res.status).toBe(200)
          expect(res.body).toStrictEqual(DEFAULT_CUSTOMER_BODY_RESPONSE)
          expect(fnService).toHaveBeenCalledTimes(1)
          // After
          await myApp.stop()
        })
      })
      describe('GetAllCustomersController - successfully case', () => {
        let fnService: jest.SpyInstance
        beforeEach(() => {
          fnService = jest.spyOn(GetAllCustomersUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_GET_ALL_CUSTOMERS_SVC_RESULT)
        })
        afterEach(() => {
          jest.restoreAllMocks()
        })
        it('GetAllCustomersController - successfully case', async () => {
          // Arrange
          const myApp = new App(DEFAULT_CONFIG)
          // Act
          await myApp.start()
          const endpointPath = `http://localhost:${DEFAULT_CONFIG.expressPort}/api/customers`
          const res = await superagent.get(endpointPath)
          console.log(`---> ${JSON.stringify(res.body)}`)
          // Assert
          expect(res.status).toBe(200)
          expect(res.body).toStrictEqual([DEFAULT_CUSTOMER_BODY_RESPONSE])
          expect(fnService).toHaveBeenCalledTimes(1)
          // After
          await myApp.stop()
        })
      })
      describe('CreateCustomerController - successfully case', () => {
        let fnService: jest.SpyInstance
        beforeEach(() => {
          fnService = jest.spyOn(CreateCustomerUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_CREATE_CUSTOMER_SVC_RESULT)
        })
        afterEach(() => {
          jest.restoreAllMocks()
        })
        it('CreateCustomerController - successfully case', async () => {
          // Arrange
          const myApp = new App(DEFAULT_CONFIG)
          // Act
          await myApp.start()
          const endpointPath = `http://localhost:${DEFAULT_CONFIG.expressPort}/api/customers`
          const res = await superagent.post(endpointPath).send(DEFAULT_CUSTOMER_BODY_REQUEST)
          console.log(`---> ${JSON.stringify(res.body)}`)
          // Assert
          expect(res.status).toBe(201)
          expect(res.body).toStrictEqual(DEFAULT_CUSTOMER_BODY_RESPONSE)
          expect(fnService).toHaveBeenCalledTimes(1)
          // After
          await myApp.stop()
        })
      })
      describe('UpdateCustomerController - successfully case', () => {
        let fnService: jest.SpyInstance
        beforeEach(() => {
          fnService = jest.spyOn(UpdateCustomerUseCase.prototype, 'execute').mockResolvedValue(DEFAULT_UPDATE_CUSTOMER_SVC_RESULT)
        })
        afterEach(() => {
          jest.restoreAllMocks()
        })
        it('UpdateCustomerController - successfully case', async () => {
          // Arrange
          const myApp = new App(DEFAULT_CONFIG)
          // Act
          await myApp.start()
          const endpointPath = `http://localhost:${DEFAULT_CONFIG.expressPort}/api/customers`
          const res = await superagent.put(endpointPath).send(DEFAULT_CUSTOMER_BODY_REQUEST)
          console.log(`---> ${JSON.stringify(res.body)}`)
          // Assert
          expect(res.status).toBe(200)
          expect(res.body).toStrictEqual(DEFAULT_CUSTOMER_BODY_RESPONSE)
          expect(fnService).toHaveBeenCalledTimes(1)
          // After
          await myApp.stop()
        })
      })
      describe('DeleteCustomerController - successfully case', () => {
        let fnService: jest.SpyInstance
        beforeEach(() => {
          fnService = jest.spyOn(DeleteCustomerByIdUseCase.prototype, 'execute').mockResolvedValue(true)
        })
        afterEach(() => {
          jest.restoreAllMocks()
        })
        it('DeleteCustomerController - successfully case', async () => {
          // Arrange
          const myApp = new App(DEFAULT_CONFIG)
          // Act
          await myApp.start()
          const endpointPath = `http://localhost:${DEFAULT_CONFIG.expressPort}/api/customers/706781a2-e4ee-4fc5-ab0f-fdf92f643c8a`
          const res = await superagent.delete(endpointPath)
          console.log(`---> ${JSON.stringify(res.body)}`)
          // Assert
          expect(res.status).toBe(204)
          expect(fnService).toHaveBeenCalledTimes(1)
          // After
          await myApp.stop()
        })
      })
    })
  })
})
