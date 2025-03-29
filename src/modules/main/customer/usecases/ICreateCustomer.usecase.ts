import { IUseCase } from 'types-ddd'

import { Customer } from '../domain/models/Customer'

export interface ICreateCustomerRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: Date
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    additionalInfo?: string
  }
  nifCif: string
}

export type ICreateCustomerResponse = Customer

export type ICreateCustomerByIdUseCase = IUseCase<ICreateCustomerRequest, ICreateCustomerResponse>
