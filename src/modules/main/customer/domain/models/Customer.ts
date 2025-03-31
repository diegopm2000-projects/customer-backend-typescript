import { Entity, Ok, Result, UID } from 'types-ddd'

import { Email } from './value-objects/Email'
import { Phone } from './value-objects/Phone'
import { Address } from './value-objects/Address'

export interface CustomerProps {
  id: UID
  firstName: string
  lastName: string
  email: Email
  phoneNumber: Phone
  dateOfBirth: Date
  address: Address
  nifCif: string // TODO montar un value object para esto
}

export class Customer extends Entity<CustomerProps> {
  get id(): UID {
    return this.props.id
  }
  get firstName(): string {
    return this.props.firstName
  }
  get lastName(): string {
    return this.props.lastName
  }
  get email(): Email {
    return this.props.email
  }
  get phoneNumber(): Phone {
    return this.props.phoneNumber
  }
  get dateOfBirth(): Date {
    return this.props.dateOfBirth
  }
  get address(): Address {
    return this.props.address
  }
  get nifCif(): string {
    return this.props.nifCif
  }

  private constructor(props: CustomerProps) {
    super(props)
  }

  public static create(props: CustomerProps): Result<Customer> {
    return Ok(new Customer(props))
  }
}
