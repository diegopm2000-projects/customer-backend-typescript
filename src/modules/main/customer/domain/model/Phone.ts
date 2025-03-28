import { Fail, Ok, Result, ValueObject } from 'types-ddd'

import { PhoneValidatorService } from '../service/PhoneValidator.service'

export interface PhoneProps {
  value: string
}

export class Phone extends ValueObject<PhoneProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: PhoneProps) {
    super(props)
  }

  public static create(props: PhoneProps): Result<Phone> {
    if (PhoneValidatorService.isValid(props.value) === false) {
      return Fail('Email must be a valid email address')
    }

    return Ok(new Phone(props))
  }
}
