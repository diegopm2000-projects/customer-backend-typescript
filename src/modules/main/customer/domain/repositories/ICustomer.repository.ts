import { UID } from 'types-ddd'
import { Customer } from '../models/Customer'

export interface ICustomerRepository {
  getAll(): Promise<Array<Customer>>
  getById(customerId: UID): Promise<Customer | undefined>
  save(customer: Customer): Promise<boolean>
  deleteById(customerId: UID): Promise<boolean>
}
