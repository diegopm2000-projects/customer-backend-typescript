import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { Customer } from '../../../domain/models/Customer'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerDTO } from '../../dtos/Customer.dto'
import { BadParametersInCustomerUpdateError } from '../../errors/BadParametersInCustomerUpdateError copy'
import { CustomerNotFoundError } from '../../errors/CustomerNotFoundError'
import { CustomerMapper } from '../../mappers/Customer.mapper'
import { IUpdateCustomerRequest, IUpdateCustomerResponse, IUpdateCustomerUseCase } from './IUpdateCustomer.usecase'

@injectable()
export class UpdateCustomerUseCase implements IUpdateCustomerUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  private buildResult(customer: Customer): CustomerDTO {
    return CustomerMapper.modelToDTO(customer)
  }

  async execute(request: IUpdateCustomerRequest): Promise<IUpdateCustomerResponse> {
    const customerToUpdateResult = Customer.create(request)
    if (customerToUpdateResult.isFail()) {
      return new BadParametersInCustomerUpdateError(request)
    }
    const customer = customerToUpdateResult.value()

    const customerFound = await this.customerRepository.getById(customer.id)
    if (!customerFound) {
      return new CustomerNotFoundError(customer.id)
    }

    await this.customerRepository.save(customer)

    return this.buildResult(customer)
  }
}
