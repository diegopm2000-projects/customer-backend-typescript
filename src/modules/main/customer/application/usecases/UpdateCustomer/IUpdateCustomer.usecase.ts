import { IUseCase, UID } from 'types-ddd'

import { Address } from '../../../domain/models/value-objects/Address'
import { Email } from '../../../domain/models/value-objects/Email'
import { Phone } from '../../../domain/models/value-objects/Phone'
import { CustomerDTO } from '../../dtos/Customer.dto'
import { BadParametersInCustomerUpdateError } from '../../errors/BadParametersInCustomerUpdateError copy'
import { CustomerNotFoundError } from '../../errors/CustomerNotFoundError'
import { SpainID } from '../../../domain/models/value-objects/SpainID'

export interface IUpdateCustomerRequest {
  id: UID
  firstName: string
  lastName: string
  email: Email
  phoneNumber: Phone
  dateOfBirth: Date
  address: Address
  nifCifNie: SpainID
}

export type IUpdateCustomerResponse = CustomerDTO | BadParametersInCustomerUpdateError | CustomerNotFoundError

export type IUpdateCustomerUseCase = IUseCase<IUpdateCustomerRequest, IUpdateCustomerResponse>
