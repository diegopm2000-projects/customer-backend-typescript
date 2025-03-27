import { Entity, Ok, Result, UID } from 'types-ddd'

import { Email } from './Email'
import { Phone } from './Phone'

export interface CustomerProps {
  id: UID
  firstName: string
  lastName: string
  email: Email
  phoneNumber: Phone
  dateOfBirth: Date
  address: string // TODO - Mejorable también, se puede usar algún objeto complejo a ver si se puede usar
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
  get address(): string {
    return this.props.address
  }

  private constructor(props: CustomerProps) {
    super(props)
  }

  public static create(props: CustomerProps): Result<Customer> {
    return Ok(new Customer(props))
  }
}
