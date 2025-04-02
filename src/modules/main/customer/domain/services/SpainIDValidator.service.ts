import { validateSpanishId } from 'spain-id'

export class SpainIDValidatorService {
  public static isValid(spainIDValue: string): boolean {
    return validateSpanishId(spainIDValue)
  }
}
