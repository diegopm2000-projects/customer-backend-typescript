// SUT
import { Address, AddressProps } from '../../../../../../../../src/modules/main/customer/domain/models/value-objects/Address'

export const DEFAULT_ADDRESS_PROPS: AddressProps = {
  street: 'myStreet',
  number: 123,
  city: 'myCity',
  state: 'myState',
  postalCode: '123456',
  country: 'myCountry',
  additionalInfo: 'myAdditionalInfo',
}

export const DEFAULT_ADDRESS = Address.create(DEFAULT_ADDRESS_PROPS).value()

describe('Address - Tests', () => {
  describe('constructor - Tests', () => {
    it('constructor - default successful case', () => {
      // Arrange
      const props = {
        street: 'myStreet',
        number: 123,
        city: 'myCity',
        state: 'myState',
        postalCode: '123456',
        country: 'myCountry',
        additionalInfo: 'myAdditionalInfo',
      }
      // Act
      const result = Address.create(props)
      const myObj = result.value()
      // Assert
      expect(result.isOk()).toBeTruthy()
      expect(myObj).toBeInstanceOf(Address)
      expect(myObj.street).toBe(props.street)
      expect(myObj.number).toBe(props.number)
      expect(myObj.city).toBe(props.city)
      expect(myObj.state).toBe(props.state)
      expect(myObj.postalCode).toBe(props.postalCode)
      expect(myObj.country).toBe(props.country)
      expect(myObj.additionalInfo).toBe(props.additionalInfo)
    })
  })
})
