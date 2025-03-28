import { ID } from 'types-ddd'

import { Email } from '../../../../../../src/modules/main/customer/domain/model/Email'
import { Phone } from '../../../../../../src/modules/main/customer/domain/model/Phone'
import { Address } from '../../../../../../src/modules/main/customer/domain/model/Address'

// SUT
import { Customer, CustomerProps } from '../../../../../../src/modules/main/customer/domain/model/Customer'

describe('Customer - Tests', () => {
  describe('constructor - Tests', () => {
    it('constructor - default successful case', () => {
      // Arrange
      const props: CustomerProps = {
        id: ID.create('706781a2-e4ee-4fc5-ab0f-fdf92f643c8a'),
        firstName: 'John',
        lastName: 'Doe',
        email: Email.create({ value: 'johndoe@mail.com' }).value(),
        phoneNumber: Phone.create({ value: '123456789' }).value(),
        dateOfBirth: new Date('1990-01-01'),
        address: Address.create({ street: 'myStreet', number: 123, city: 'myCity', state: 'myState', postalCode: '123456', country: 'myCountry', additionalInfo: 'myAdditionalInfo' }).value(),
      }
      // Act
      const result = Customer.create(props)
      const myObj = result.value()
      // Assert
      expect(result.isOk()).toBeTruthy()
      expect(myObj).toBeInstanceOf(Customer)
      expect(myObj.id).toBe(props.id)
      expect(myObj.firstName).toBe(props.firstName)
      expect(myObj.lastName).toBe(props.lastName)
      expect(myObj.email).toBe(props.email)
      expect(myObj.phoneNumber).toBe(props.phoneNumber)
      expect(myObj.dateOfBirth).toBe(props.dateOfBirth)
      expect(myObj.address).toBe(props.address)
    })
  })
})
