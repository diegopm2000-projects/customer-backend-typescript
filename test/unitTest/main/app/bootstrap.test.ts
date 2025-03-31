import { App } from '../../../../src/app/app'
import { MESSAGE_TEST_FAILED } from '../../expectations/expectations.global'

// SUT
import { init } from '../../../../src/app/bootstrap'

jest.mock('dotenv', () => ({
  config: jest.fn().mockImplementation(() => {
    // No estamos actualizando process.env aquí por defecto, lo haremos manualmente
    return { parsed: {} }
  }),
}))

describe('Bootstrap - Tests', () => {
  describe('init - Tests', () => {
    describe('init - default successfully case', () => {
      beforeEach(() => {
        jest.spyOn(App.prototype, 'start').mockResolvedValue(true)
        process.env.MONGO_DB_URI = 'http://localhost:27017'
        process.env.EXPRESS_PORT = '3000'
      })
      afterEach(() => {
        jest.restoreAllMocks()
        delete process.env.MONGO_DB_URI
        delete process.env.EXPRESS_PORT
      })
      it('init - default successfully case', async () => {
        // Arrange
        // N/A
        // Act
        const myApp = await init()
        // Assert
        expect(myApp).toBeDefined()
        // Stop the app
        await myApp.stop()
      })
    })
    describe('init - successfully case when EXPRESS_PORT is not defined', () => {
      beforeEach(() => {
        jest.spyOn(App.prototype, 'start').mockResolvedValue(true)
        process.env.MONGO_DB_URI = 'http://localhost:27017'
      })
      afterEach(() => {
        jest.restoreAllMocks()
        delete process.env.MONGO_DB_URI
      })
      it('init - successfully case when EXPRESS_PORT is not defined', async () => {
        // Arrange
        // N/A
        // Act
        const myApp = await init()
        // Assert
        expect(myApp).toBeDefined()
        // Stop the app
        await myApp.stop()
      })
    })
    describe('init - failed case when MONGO_DB_URI is not defined', () => {
      beforeEach(() => {
        jest.spyOn(App.prototype, 'start').mockResolvedValue(true)
        process.env.EXPRESS_PORT = '3000'
      })
      afterEach(() => {
        jest.restoreAllMocks()
        delete process.env.EXPRESS_PORT
      })
      it('init - failed case when MONGO_DB_URI is not defined', async () => {
        // Arrange
        // N/A
        try {
          // Act
          await init()
          // Assert
          fail(MESSAGE_TEST_FAILED)
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
          expect((error as Error).message).toBe('MONGO_DB_URI is not defined')
        }
      })
    })
  })
})
