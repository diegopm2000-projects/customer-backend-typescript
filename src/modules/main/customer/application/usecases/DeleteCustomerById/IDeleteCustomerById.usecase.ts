import { IUseCase } from 'types-ddd'
import { CommonResultDTO } from '../../../../../shared/application/CommonResultDTO'

export interface IDeleteCustomerByIdRequest {
  customerId: string
}

export type IDeleteCustomerByIdResponse = CommonResultDTO

export type IDeleteCustomerByIdUseCase = IUseCase<IDeleteCustomerByIdRequest, IDeleteCustomerByIdResponse>
