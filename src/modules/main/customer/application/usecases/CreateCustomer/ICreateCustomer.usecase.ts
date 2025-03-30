import { IUseCase, UID } from 'types-ddd'

import { Address } from '../../../domain/models/value-objects/Address'
import { Email } from '../../../domain/models/value-objects/Email'
import { Phone } from '../../../domain/models/value-objects/Phone'
import { BadParametersInCustomerCreationError } from '../../errors/BadParametersInCustomerCreationError'
import { CustomerDTO } from '../../dtos/Customer.dto'
import { CustomerAlreadyExistsError } from '../../errors/CustomerAlreadyExistsError'

export interface ICreateCustomerRequest {
  id: UID
  firstName: string
  lastName: string
  email: Email
  phoneNumber: Phone
  dateOfBirth: Date
  address: Address
  nifCif: string
}

// TODO - Se podría montar aquí el result tambien para envolver las respuestas
export type ICreateCustomerResponse = CustomerDTO | BadParametersInCustomerCreationError | CustomerAlreadyExistsError

export type ICreateCustomerUseCase = IUseCase<ICreateCustomerRequest, ICreateCustomerResponse>
