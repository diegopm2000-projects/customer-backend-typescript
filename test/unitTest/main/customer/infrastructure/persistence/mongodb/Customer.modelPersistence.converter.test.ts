// import { omit } from 'lodash'

import { DEFAULT_CUSTOMER } from '../../../domain/model/Customer.test'

// SUT
import { CustomerModelPersistenceConverter } from '../../../../../../../src/modules/main/customer/infrastructure/persistence/mongodb/Customer.modelPersistence.converter'

const DEFAULT_MODEL = DEFAULT_CUSTOMER

const DEFAULT_MODEL_PERSISTENCE = {
  _id: DEFAULT_CUSTOMER.id.value(),
  firstName: DEFAULT_CUSTOMER.firstName,
  lastName: DEFAULT_CUSTOMER.lastName,
  email: DEFAULT_CUSTOMER.email.value,
  phoneNumber: DEFAULT_CUSTOMER.phoneNumber.value,
  dateOfBirth: DEFAULT_CUSTOMER.dateOfBirth,
  address: {
    street: 'myStreet',
    number: 123,
    city: 'myCity',
    state: 'myState',
    postalCode: '123456',
    country: 'myCountry',
    additionalInfo: 'myAdditionalInfo',
  },
  nifCif: DEFAULT_CUSTOMER.nifCif,
}

describe('CustomerModelPersistenceConverter - Tests', () => {
  describe('modelToModelPersistence - Tests', () => {
    it('modelToModelPersistence - default successful case', () => {
      // Arrange
      const model = DEFAULT_MODEL
      // Act
      const result = CustomerModelPersistenceConverter.modelToModelPersistence(model)
      // Assert
      expect(result).toEqual(DEFAULT_MODEL_PERSISTENCE)
    })
  })

  describe('modelPersistenceToModel - Tests', () => {
    it('modelPersistenceToModel - default successful case', () => {
      // Arrange
      const mp = DEFAULT_MODEL_PERSISTENCE
      // Act
      const result = CustomerModelPersistenceConverter.modelPersistenceToModel(mp)
      console.log(`----> result: ${JSON.stringify(result)}`)
      // Assert
      expect(result.id.value()).toEqual(DEFAULT_MODEL_PERSISTENCE._id)
      expect(result.firstName).toEqual(DEFAULT_MODEL_PERSISTENCE.firstName)
      expect(result.lastName).toEqual(DEFAULT_MODEL_PERSISTENCE.lastName)
      expect(result.email.value).toEqual(DEFAULT_MODEL_PERSISTENCE.email)
      expect(result.phoneNumber.value).toEqual(DEFAULT_MODEL_PERSISTENCE.phoneNumber)
      expect(result.dateOfBirth).toEqual(DEFAULT_MODEL_PERSISTENCE.dateOfBirth)
      expect(result.address.street).toEqual(DEFAULT_MODEL_PERSISTENCE.address.street)
      expect(result.address.number).toEqual(DEFAULT_MODEL_PERSISTENCE.address.number)
      expect(result.address.city).toEqual(DEFAULT_MODEL_PERSISTENCE.address.city)
      expect(result.address.state).toEqual(DEFAULT_MODEL_PERSISTENCE.address.state)
      expect(result.address.postalCode).toEqual(DEFAULT_MODEL_PERSISTENCE.address.postalCode)
      expect(result.address.country).toEqual(DEFAULT_MODEL_PERSISTENCE.address.country)
      expect(result.address.additionalInfo).toEqual(DEFAULT_MODEL_PERSISTENCE.address.additionalInfo)
      expect(result.nifCif).toEqual(DEFAULT_MODEL_PERSISTENCE.nifCif)
    })
  })
})
