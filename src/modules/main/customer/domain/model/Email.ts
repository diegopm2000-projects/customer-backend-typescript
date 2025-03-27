import { Result, Ok, ValueObject, Fail } from 'types-ddd'

import { EmailValidatorService } from '../service/EmailValidator.service'

export interface EmailProps {
  value: string
}

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: EmailProps) {
    super(props)
  }

  public static create(props: EmailProps): Result<Email> {
    if (EmailValidatorService.isValid(props.value) === false) {
      return Fail('Email must be a valid email address')
    }

    return Ok(new Email(props))
  }
}
