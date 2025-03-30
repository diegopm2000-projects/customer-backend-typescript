// SUT
import { Phone } from '../../../../../../../../src/modules/main/customer/domain/models/value-objects/Phone'

describe('Phone - Tests', () => {
  describe('constructor - Tests', () => {
    it('constructor - default successful case', () => {
      // Arrange
      const props = {
        value: '+34 666666666',
      }
      // Act
      const result = Phone.create(props)
      const myObj = result.value()
      // Assert
      expect(result.isOk()).toBeTruthy()
      expect(myObj).toBeInstanceOf(Phone)
      expect(myObj.value).toBe(props.value)
    })
    it('constructor - failed case when Phone is invalid', () => {
      // Arrange
      const props = {
        value: 'nonsense',
      }
      // Act
      const result = Phone.create(props)
      // Assert
      expect(result.isFail()).toBeTruthy()
    })
  })
})
