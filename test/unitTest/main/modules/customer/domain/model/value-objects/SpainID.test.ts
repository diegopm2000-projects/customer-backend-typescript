// SUT
import { SpainID } from '../../../../../../../../src/modules/main/customer/domain/models/value-objects/SpainID'

export const DEFAULT_NIFCIFNIE = SpainID.create({ value: '39740191D' }).value()

describe('SpainID - Tests', () => {
  describe('constructor - Tests', () => {
    it('constructor - default successful case', () => {
      // Arrange
      const props = {
        value: '39740191D',
      }
      // Act
      const result = SpainID.create(props)
      const myObj = result.value()
      // Assert
      expect(result.isOk()).toBeTruthy()
      expect(myObj).toBeInstanceOf(SpainID)
      expect(myObj.value).toBe(props.value)
    })
    it('constructor - failed case when SpainID is invalid', () => {
      // Arrange
      const props = {
        value: 'nonsense',
      }
      // Act
      const result = SpainID.create(props)
      // Assert
      expect(result.isFail()).toBeTruthy()
    })
  })
})
