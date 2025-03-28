import { Entity, Ok, Result, UID } from 'types-ddd'

import { Email } from './Email'
import { Phone } from './Phone'
import { Address } from './Address'

export interface CustomerProps {
  id: UID
  firstName: string
  lastName: string
  email: Email
  phoneNumber: Phone
  dateOfBirth: Date
  address: Address
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

  private constructor(props: CustomerProps) {
    super(props)
  }

  public static create(props: CustomerProps): Result<Customer> {
    return Ok(new Customer(props))
  }
}
