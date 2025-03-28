import { isEmail } from 'validator'

export class EmailValidatorService {
  public static isValid(email: string): boolean {
    return isEmail(email)
  }
}
