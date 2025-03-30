import { phone } from 'phone'

export class PhoneValidatorService {
  public static isValid(phoneValue: string): boolean {
    return phone(phoneValue).isValid
  }
}
