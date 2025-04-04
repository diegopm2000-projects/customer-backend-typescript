import { Result, Ok, ValueObject, Fail } from 'types-ddd'
import { SpainIDValidatorService } from '../../services/SpainIDValidator.service'

export interface SpainIDProps {
  value: string
}

export class SpainID extends ValueObject<SpainIDProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: SpainIDProps) {
    super(props)
  }

  public static create(props: SpainIDProps): Result<SpainID> {
    if (SpainIDValidatorService.isValid(props.value) === false) {
      return Fail('nif/cif/nie must be a valid NIF/CIF/NIE')
    }

    return Ok(new SpainID(props))
  }
}
