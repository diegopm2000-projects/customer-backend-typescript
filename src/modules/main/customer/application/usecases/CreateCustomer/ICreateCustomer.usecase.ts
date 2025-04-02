import { IUseCase, UID } from 'types-ddd'

import { Address } from '../../../domain/models/value-objects/Address'
import { Email } from '../../../domain/models/value-objects/Email'
import { Phone } from '../../../domain/models/value-objects/Phone'
import { SpainID } from '../../../domain/models/value-objects/SpainID'
import { CustomerDTO } from '../../dtos/Customer.dto'
import { BadParametersInCustomerCreationError } from '../../errors/BadParametersInCustomerCreationError'
import { CustomerAlreadyExistsByIDError } from '../../errors/CustomerAlreadyExistsByIDError'
import { CustomerAlreadyExistsByDNINIFCIFError } from '../../errors/CustomerAlreadyExistsByNIFCIFNIEError'

export interface ICreateCustomerRequest {
  id: UID
  firstName: string
  lastName: string
  email: Email
  phoneNumber: Phone
  dateOfBirth: Date
  address: Address
  nifCifNie: SpainID
}

// TODO - Se podría montar aquí el result tambien para envolver las respuestas
export type ICreateCustomerResponse = CustomerDTO | BadParametersInCustomerCreationError | CustomerAlreadyExistsByIDError | CustomerAlreadyExistsByDNINIFCIFError

export type ICreateCustomerUseCase = IUseCase<ICreateCustomerRequest, ICreateCustomerResponse>
