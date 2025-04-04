// SUT
import { AvailableCredit } from '../../../../../../../../src/modules/main/customer/domain/models/value-objects/AvailableCredit'

export const DEFAULT_AVAILABLE_CREDIT = AvailableCredit.create({ value: 10000 }).value()

describe('AvailableCredit - Tests', () => {
  it('constructor - default successful case', () => {
    // Arrange
    const props = {
      value: 10000,
    }
    // Act
    const result = AvailableCredit.create(props)
    const myObj = result.value()
    // Assert
    expect(result.isOk()).toBeTruthy()
    expect(myObj).toBeInstanceOf(AvailableCredit)
    expect(myObj.value).toBe(props.value)
  })
  it('constructor - failed case when email is invalid', () => {
    // Arrange
    const props = {
      value: -1,
    }
    // Act
    const result = AvailableCredit.create(props)
    // Assert
    expect(result.isFail()).toBeTruthy()
  })
})
