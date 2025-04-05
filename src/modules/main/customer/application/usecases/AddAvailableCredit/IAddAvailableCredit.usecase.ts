import { IUseCase } from 'types-ddd'

import { AvailableCredit } from '../../../domain/models/value-objects/AvailableCredit'
import { CustomerNotFoundError } from '../../errors/CustomerNotFoundError'
import { CustomerDTO } from '../../dtos/Customer.dto'

export interface IAddAvailableCreditRequest {
  customerId: string
  availableCredit: AvailableCredit
}

export type IAddAvailableCreditResponse = CustomerDTO | CustomerNotFoundError

export type IAddAvailableCreditUseCase = IUseCase<IAddAvailableCreditRequest, IAddAvailableCreditResponse>
