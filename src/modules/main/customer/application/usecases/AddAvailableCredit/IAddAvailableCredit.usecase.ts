import { IUseCase } from 'types-ddd'

import { AvailableCredit } from '../../../domain/models/value-objects/AvailableCredit'
import { CustomerNotFoundError } from '../../errors/CustomerNotFoundError'

export interface IAddAvailableCreditRequest {
  customerId: string
  availableCredit: AvailableCredit
}

export type IAddAvailableCreditResponse = boolean | CustomerNotFoundError

export type IAddAvailableCreditUseCase = IUseCase<IAddAvailableCreditRequest, IAddAvailableCreditResponse>
