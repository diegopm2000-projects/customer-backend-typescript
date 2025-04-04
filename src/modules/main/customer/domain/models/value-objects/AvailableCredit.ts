import { Fail, Ok, Result, ValueObject } from 'types-ddd'

export interface AvailableCreditProps {
  value: number
}

export class AvailableCredit extends ValueObject<AvailableCreditProps> {
  public get value(): number {
    return this.props.value
  }

  private constructor(props: AvailableCreditProps) {
    super(props)
  }

  public static create(props: AvailableCreditProps): Result<AvailableCredit> {
    if (props.value < 0) {
      return Fail('credit value must be greater or equal to 0')
    }

    return Ok(new AvailableCredit(props))
  }
}
