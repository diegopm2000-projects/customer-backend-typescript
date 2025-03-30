import { IUseCase } from 'types-ddd'

import { CustomerDTO } from '../../dtos/Customer.dto'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetAllCustomersRequest {}

export type IGetAllCustomersResponse = Array<CustomerDTO>

export type IGetAllCustomersUseCase = IUseCase<IGetAllCustomersRequest, IGetAllCustomersResponse>
