import { IUseCase } from 'types-ddd'

import { CustomerDTO } from '../dtos/Customer.dto'

export interface IGetCustomerByIdRequest {
  customerId: string
}

export type IGetCustomerByIdResponse = CustomerDTO | undefined

export type IGetCustomerByIdUseCase = IUseCase<IGetCustomerByIdRequest, IGetCustomerByIdResponse>
