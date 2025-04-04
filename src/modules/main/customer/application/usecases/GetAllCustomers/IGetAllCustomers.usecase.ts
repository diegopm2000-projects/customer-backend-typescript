import { IUseCase } from 'types-ddd'

import { CustomerDTO } from '../../dtos/Customer.dto'

export enum CUSTOMER_SORT_FIELD {
  availableCredit = 'availableCredit',
}

export enum ORDER_DIRECTION {
  desc = 'desc',
  asc = 'asc',
}

export interface OrderingParams {
  field: CUSTOMER_SORT_FIELD
  order: ORDER_DIRECTION
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetAllCustomersRequest {
  orderingParams?: OrderingParams
}

export type IGetAllCustomersResponse = Array<CustomerDTO>

export type IGetAllCustomersUseCase = IUseCase<IGetAllCustomersRequest, IGetAllCustomersResponse>
