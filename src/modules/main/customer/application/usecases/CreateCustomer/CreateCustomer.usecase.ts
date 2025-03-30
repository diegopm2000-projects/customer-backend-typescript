import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { Customer } from '../../../domain/models/Customer'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerDTO } from '../../dtos/Customer.dto'
import { BadParametersInCustomerCreationError } from '../../errors/BadParametersInCustomerCreationError'
import { CustomerAlreadyExistsError } from '../../errors/CustomerAlreadyExistsError'
import { CustomerMapper } from '../../mappers/Customer.mapper'
import { ICreateCustomerRequest, ICreateCustomerResponse, ICreateCustomerUseCase } from './ICreateCustomer.usecase'

@injectable()
export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  private buildResult(customer: Customer): CustomerDTO {
    return CustomerMapper.modelToDTO(customer)
  }

  async execute(request: ICreateCustomerRequest): Promise<ICreateCustomerResponse> {
    const customerToCreateResult = Customer.create(request)
    if (customerToCreateResult.isFail()) {
      return new BadParametersInCustomerCreationError(request)
    }
    const customer = customerToCreateResult.value()
    console.log(`----> customer to be created: ${JSON.stringify(customer)}`)
    console.log(`----> customer.id: ${customer.id.value}`)

    const customerFound = await this.customerRepository.getById(customer.id)
    if (customerFound) {
      return new CustomerAlreadyExistsError(customer.id)
    }

    console.log(`---> justo antes de llamar al save...`)

    await this.customerRepository.save(customer)

    return this.buildResult(customer)
  }
}
