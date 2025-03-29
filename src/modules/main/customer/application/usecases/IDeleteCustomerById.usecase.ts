import { IUseCase } from 'types-ddd'

export interface IDeleteCustomerByIdRequest {
  customerId: string
}

export type IDeleteCustomerByIdResponse = boolean

export type IDeleteCustomerByIdUseCase = IUseCase<IDeleteCustomerByIdRequest, IDeleteCustomerByIdResponse>
