import { Customer } from '../models/Customer'

export interface ICustomerRepository {
  getAll: () => Promise<Array<Customer>>
  getById: (customerId: string) => Promise<Customer | undefined>
}
