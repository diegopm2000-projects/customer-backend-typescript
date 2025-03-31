// SUT
import { Phone } from '../../../../../../../src/modules/main/customer/domain/models/value-objects/Phone'

export const DEFAULT_PHONE = Phone.create({ value: '+34 666666666' }).value()

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
      console.log(`----> phone en el test: ${JSON.stringify(myObj)}`)
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
