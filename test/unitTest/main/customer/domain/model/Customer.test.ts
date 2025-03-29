import { ID } from 'types-ddd'

import { DEFAULT_EMAIL } from './Email.test'
import { DEFAULT_PHONE } from './Phone.test'

// SUT
import { Customer, CustomerProps } from '../../../../../../src/modules/main/customer/domain/models/Customer'
import { DEFAULT_ADDRESS } from './Address.test'

const DEFAULT_CUSTOMER_PROPS: CustomerProps = {
  // TODO - Creo que tira con cualquier id...ver si se puede forzar a uuid
  id: ID.create('706781a2-e4ee-4fc5-ab0f-fdf92f643c8a'),
  firstName: 'John',
  lastName: 'Doe',
  email: DEFAULT_EMAIL,
  phoneNumber: DEFAULT_PHONE,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS,
  nifCif: '123456789Z',
}

export const DEFAULT_CUSTOMER = Customer.create(DEFAULT_CUSTOMER_PROPS).value()

describe('Customer - Tests', () => {
  describe('constructor - Tests', () => {
    it('constructor - default successful case', () => {
      // Arrange
      const props: CustomerProps = DEFAULT_CUSTOMER_PROPS
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
      expect(myObj.nifCif).toBe(props.nifCif)
    })
  })
})
