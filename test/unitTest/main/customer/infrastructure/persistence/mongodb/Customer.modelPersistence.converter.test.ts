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

  // describe('modelPersistenceToModel - Tests', () => {
  //   it('modelPersistenceToModel - default successful case', () => {
  //     // Arrange
  //     const mp = DEFAULT_MODEL_PERSISTENCE
  //     // Act
  //     const result = CustomerModelPersistenceConverter.modelPersistenceToModel(mp)
  //     console.log(`----> result: ${JSON.stringify(result)}`)
  //     // Assert
  //     expect(omit(result, ['createdAt', 'updatedAt'])).toStrictEqual(omit(DEFAULT_MODEL, ['_createdAt', '_updatedAt']))
  //   })
  // })
})
