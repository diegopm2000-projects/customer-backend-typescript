/* eslint-disable @typescript-eslint/no-explicit-any */

// SUT
import { ExpressInfra } from '../../../../../../src/modules/shared/infrastructure/express/ExpressInfra'

const DEFAULT_PARAMS = {
  port: 3000,
}

describe('ExpressInfra - Tests', () => {
  describe('start & stop - Tests', () => {
    it('start & stop - default successful case', async () => {
      // Arrange
      const params = DEFAULT_PARAMS
      const expressInfra = new ExpressInfra(params)
      // Act
      const result = await expressInfra.start()
      // Assert
      expect(result).toBeTruthy()
      // Stop the server
      const stopResult = await expressInfra.stop()
      expect(stopResult).toBeTruthy()
    })
    describe('stop - Failed case when the server is not running', () => {
      it('stop - Failed case when the server is not running', async () => {
        // Arrange
        const params = DEFAULT_PARAMS
        const expressInfra = new ExpressInfra(params)
        try {
          // Act
          await expressInfra.stop()
        } catch (error) {
          // Assert
          expect(error).toBeInstanceOf(Error)
        }
      })
    })
  })

  describe('get app - Tests', () => {
    it('get app - default successful case', async () => {
      // Arrange
      const params = DEFAULT_PARAMS
      const expressInfra = new ExpressInfra(params)
      // Act
      expressInfra.start()
      const app = expressInfra.app
      // Assert
      expect(app).toBeTruthy()
      // Stop the server
      const stopResult = await expressInfra.stop()
      expect(stopResult).toBeTruthy()
    })
    it('get app - failed case when server is not running', async () => {
      // Arrange
      const params = DEFAULT_PARAMS
      const expressInfra = new ExpressInfra(params)
      try {
        // Act
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const app = expressInfra.app
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(Error)
      }
    })
  })
})
