import { Ok, Result, ValueObject } from 'types-ddd'

export interface AddressProps {
  street: string
  number: number
  city: string
  state: string
  postalCode: string
  country: string
  additionalInfo?: string
}

export class Address extends ValueObject<AddressProps> {
  get street(): string {
    return this.props.street
  }
  get number(): number {
    return this.props.number
  }
  get city(): string {
    return this.props.city
  }
  get state(): string {
    return this.props.state
  }
  get postalCode(): string {
    return this.props.postalCode
  }
  get country(): string {
    return this.props.country
  }
  get additionalInfo(): string | undefined {
    return this.props.additionalInfo
  }

  private constructor(props: AddressProps) {
    super(props)
  }

  public static create(props: AddressProps): Result<Address> {
    return Ok(new Address(props))
  }
}
