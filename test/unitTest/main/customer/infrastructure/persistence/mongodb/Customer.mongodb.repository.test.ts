/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import 'reflect-metadata'

import { ID } from 'types-ddd'
import { CountDocumentsOptions, Document, Filter, FindOneAndUpdateOptions, MongoClient, UpdateFilter } from 'mongodb'

import { ICustomerRepository } from '../../../../../../../src/modules/main/customer/domain/repositories/ICustomer.repository'
import { TYPES } from '../../../../../../../src/modules/shared/infrastructure/dependencyInjection/types'
import { ContainerFactory } from '../../../../../expectations/expectations.container'
import { ALT_2_CUSTOMER, ALT_CUSTOMER, DEFAULT_CUSTOMER } from '../../../../customer/domain/model/Customer.test'
import { MESSAGE_TEST_FAILED } from '../../../../../expectations/expectations.global'

const EXAMPLE_MODEL_PERSISTENCE_DEFAULT = {
  _id: 'cd4ef971-2f9b-4b18-830f-b5ead60565fe',
  address: {
    street: 'myStreet',
    number: 123,
    city: 'myCity',
    state: 'myState',
    postalCode: '123456',
    country: 'myCountry',
    additionalInfo: 'myAdditionalInfo',
  },
  dateOfBirth: {
    $date: '1992-01-01T00:00:00.000Z',
  },
  email: 'johndoe@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  modifiedAt: {
    $date: '2025-03-30T14:15:28.928Z',
  },
  nifCif: '123456789Z',
  phoneNumber: '+34 666666666',
}

const mongoMock = {
  db: () => ({
    collection: (collectionName: string) => ({
      find: (filter: Filter<Document>, options: CountDocumentsOptions) => ({
        toArray: () => [EXAMPLE_MODEL_PERSISTENCE_DEFAULT],
      }),
      findOne: (filter: Filter<Document>, options: CountDocumentsOptions) => {
        if (JSON.stringify(filter) == JSON.stringify({ _id: DEFAULT_CUSTOMER.id.value() })) {
          return EXAMPLE_MODEL_PERSISTENCE_DEFAULT
        } else {
          return undefined
        }
      },
      findOneAndUpdate: (filter: Filter<Document>, update: UpdateFilter<Document>, options: FindOneAndUpdateOptions) => {
        if (JSON.stringify(filter) == JSON.stringify({ _id: DEFAULT_CUSTOMER.id.value() })) {
          return { ok: 1, value: EXAMPLE_MODEL_PERSISTENCE_DEFAULT }
        } else if (JSON.stringify(filter) == JSON.stringify({ _id: ALT_CUSTOMER.id.value() })) {
          return { ok: 0, value: undefined }
        } else {
          return { ok: 1, value: undefined }
        }
      },
      deleteOne: (filter: Filter<Document>) => {
        if (JSON.stringify(filter) == JSON.stringify({ _id: DEFAULT_CUSTOMER.id.value() })) {
          return { acknowledged: true, deletedCount: 1 }
        } else {
          return { acknowledged: false, deletedCount: 0 }
        }
      },
    }),
  }),
}

describe('CustomerMongoDBRepository - Tests', () => {
  let myRepository: ICustomerRepository
  beforeAll(async () => {
    const container = await ContainerFactory.getDefaultContainer()
    // SUT
    myRepository = container.get<ICustomerRepository>(TYPES.ICustomerRepository)
  })
  beforeEach(() => {
    jest.spyOn(MongoClient.prototype as any, 'connect').mockResolvedValue(mongoMock)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  describe('getAll - Tests', () => {
    it('getAll - default successful case', async () => {
      // Arrange
      // N/A
      // Act
      const result = await myRepository.getAll()
      // Assert
      expect(result.length).toBe(1)
    })
  })
  describe('getById - Tests', () => {
    it('getById - successful case when customer was found', async () => {
      // Arrange
      // N/A
      // Act
      const result = await myRepository.getById(DEFAULT_CUSTOMER.id)
      // Assert
      expect(result).toBeDefined()
    })
    it('getById - case when customer was not found', async () => {
      // Arrange
      // N/A
      // Act
      const result = await myRepository.getById(ID.create('b297166b-a16a-42f8-8828-86496d46f06d'))
      // Assert
      expect(result).toBeUndefined()
    })
  })
  describe('save - Tests', () => {
    it('save - successful case when customer was saved', async () => {
      // Arrange
      // N/A
      // Act
      const result = await myRepository.save(DEFAULT_CUSTOMER)
      // Assert
      expect(result).toBeTruthy()
    })
    it('save - case when the object was not saved properly, throwing an exception', async () => {
      // Arrange
      // N/A
      try {
        // Act
        await myRepository.save(ALT_CUSTOMER)
        fail(MESSAGE_TEST_FAILED)
      } catch (error) {
        // Assert
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(Error)
      }
    })
    it('save - case when the object was not saved properly, throwing an exception', async () => {
      // Arrange
      // N/A
      // Act
      const result = await myRepository.save(ALT_2_CUSTOMER)
      // Assert
      expect(result).toBeFalsy()
    })
  })
  describe('deleteById - Tests', () => {
    it('deleteById - successful case when customer was deleted', async () => {
      // Arrange
      // N/A
      // Act
      const result = await myRepository.deleteById(DEFAULT_CUSTOMER.id)
      // Assert
      expect(result).toBeTruthy()
    })
    it('deleteById - case when customer was not deleted', async () => {
      // Arrange
      // N/A
      try {
        // Act
        await myRepository.deleteById(ID.create('b297166b-a16a-42f8-8828-86496d46f06d'))
        fail(MESSAGE_TEST_FAILED)
      } catch (error) {
        // Assert
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(Error)
      }
    })
  })
})
