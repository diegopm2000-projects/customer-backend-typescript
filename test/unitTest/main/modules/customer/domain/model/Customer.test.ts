/* eslint-disable sonarjs/no-duplicate-string */

import { ID } from 'types-ddd'

import { DEFAULT_ADDRESS } from './value-objects/Address.test'
import { DEFAULT_EMAIL } from './value-objects/Email.test'
import { DEFAULT_PHONE } from './value-objects/Phone.test'
import { DEFAULT_NIFCIFNIE } from './value-objects/SpainID.test'

// SUT
import { Customer, CustomerProps } from '../../../../../../../src/modules/main/customer/domain/models/Customer'

const DEFAULT_CUSTOMER_PROPS: CustomerProps = {
  id: ID.create('706781a2-e4ee-4fc5-ab0f-fdf92f643c8a'),
  firstName: 'John',
  lastName: 'Doe',
  email: DEFAULT_EMAIL,
  phoneNumber: DEFAULT_PHONE,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS,
  nifCifNie: DEFAULT_NIFCIFNIE,
}

export const DEFAULT_CUSTOMER = Customer.create(DEFAULT_CUSTOMER_PROPS).value()

const ALT_CUSTOMER_PROPS: CustomerProps = {
  id: ID.create('15d21aba-3b1f-4b59-9b56-212e3189f38c'),
  firstName: 'Richard',
  lastName: 'Stallman',
  email: DEFAULT_EMAIL,
  phoneNumber: DEFAULT_PHONE,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS,
  nifCifNie: DEFAULT_NIFCIFNIE,
}

export const ALT_CUSTOMER = Customer.create(ALT_CUSTOMER_PROPS).value()

const ALT_2_CUSTOMER_PROPS: CustomerProps = {
  id: ID.create('b2f044a2-f660-4471-b294-52d6e14dc288'),
  firstName: 'Dennis',
  lastName: 'Ritchie',
  email: DEFAULT_EMAIL,
  phoneNumber: DEFAULT_PHONE,
  dateOfBirth: new Date('1990-01-01'),
  address: DEFAULT_ADDRESS,
  nifCifNie: DEFAULT_NIFCIFNIE,
}

export const ALT_2_CUSTOMER = Customer.create(ALT_2_CUSTOMER_PROPS).value()

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
      expect(myObj.nifCifNie).toBe(props.nifCifNie)
    })
  })
})
