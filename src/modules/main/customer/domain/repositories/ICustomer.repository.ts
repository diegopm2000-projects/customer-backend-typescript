/* eslint-disable @typescript-eslint/no-explicit-any */

import { UID } from 'types-ddd'
import { Customer } from '../models/Customer'
import { SpainID } from '../models/value-objects/SpainID'

export interface ICustomerRepository {
  getAll(): Promise<Array<Customer>>
  getById(customerId: UID): Promise<Customer | undefined>
  getByNIFCIFNIE(dninifnie: SpainID): Promise<Customer | undefined>
  save(customer: Customer): Promise<boolean>
  deleteById(customerId: UID): Promise<boolean>
}
