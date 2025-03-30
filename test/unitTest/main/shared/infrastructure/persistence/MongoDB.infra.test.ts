/* eslint-disable @typescript-eslint/no-explicit-any */

import { MongoClient } from 'mongodb'

import { mongoMock } from '../../../customer/infrastructure/persistence/mongodb/Customer.mongodb.repository.test'

// SUT
import { MongodBInfra } from '../../../../../../src/modules/shared/infrastructure/persistence/mongodb/MongoDBInfra'

const DEFAULT_URI = 'mongodb://localhost:27017'

describe('MongoDBInfra - Tests', () => {
  describe('constructor - Tests', () => {
    it('constructor - default successful case', async () => {
      // Arrange
      const params = {
        uri: DEFAULT_URI,
      }
      // Act
      const result = new MongodBInfra(params)
      // Assert
      expect(result).toBeDefined()
      expect(result.uri).toBe(params.uri)
    })
  })

  describe('getConnectionDb - Tests', () => {
    beforeEach(() => {
      jest.spyOn(MongoClient.prototype as any, 'connect').mockResolvedValue(mongoMock)
    })
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('getConnectionDb - default successful case', async () => {
      // Arrange
      const params = {
        uri: DEFAULT_URI,
      }
      const mongoDBInfra = new MongodBInfra(params)
      // Act
      const result = await mongoDBInfra.getConnectionDb()
      // Assert
      expect(result).toBeDefined()
    })
  })

  describe('closeConnectionDb - Tests', () => {
    beforeEach(() => {
      jest.spyOn(MongoClient.prototype as any, 'connect').mockResolvedValue(mongoMock)
      jest.spyOn(MongoClient.prototype as any, 'close').mockResolvedValue(undefined)
    })
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('closeConnectionDb - default successful case', async () => {
      // Arrange
      const params = {
        uri: DEFAULT_URI,
      }
      const mongoDBInfra = new MongodBInfra(params)
      await mongoDBInfra.getConnectionDb()
      // Act
      const result = await mongoDBInfra.closeConnectionDb()
      // Assert
      expect(result).toBeUndefined()
    })
  })
})
