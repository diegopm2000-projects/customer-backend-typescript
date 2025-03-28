// SUT
import { Email } from '../../../../../../src/modules/main/customer/domain/model/Email'

describe('Email - Tests', () => {
  describe('constructor - Tests', () => {
    it('constructor - default successful case', () => {
      // Arrange
      const props = {
        value: 'jonhdoe@mail.com',
      }
      // Act
      const result = Email.create(props)
      const myObj = result.value()
      // Assert
      expect(result.isOk()).toBeTruthy()
      expect(myObj).toBeInstanceOf(Email)
      expect(myObj.value).toBe(props.value)
    })
    it('constructor - failed case when email is invalid', () => {
      // Arrange
      const props = {
        value: 'nonsense',
      }
      // Act
      const result = Email.create(props)
      // Assert
      expect(result.isFail()).toBeTruthy()
    })
  })
})
