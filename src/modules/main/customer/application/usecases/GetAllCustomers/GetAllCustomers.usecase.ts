import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { Customer } from '../../../domain/models/Customer'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerDTO } from '../../dtos/Customer.dto'
import { CustomerMapper } from '../../mappers/Customer.mapper'
import { IGetAllCustomersRequest, IGetAllCustomersResponse, IGetAllCustomersUseCase } from './IGetAllCustomers.usecase'

@injectable()
export class GetAllCustomersUseCase implements IGetAllCustomersUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  private buildResult(customerList: Array<Customer>): Array<CustomerDTO> {
    return customerList.map((customer) => CustomerMapper.modelToDTO(customer))
  }

  async execute(request: IGetAllCustomersRequest): Promise<IGetAllCustomersResponse> {
    const { orderingParams } = request

    const customerList = await this.customerRepository.getAll(orderingParams)

    return this.buildResult(customerList)
  }
}
