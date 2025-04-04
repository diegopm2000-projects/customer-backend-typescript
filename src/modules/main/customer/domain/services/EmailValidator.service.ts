import { isEmail } from 'validator'

export class EmailValidatorService {
  public static isValid(emailValue: string): boolean {
    return isEmail(emailValue)
  }
}
