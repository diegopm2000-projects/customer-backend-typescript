import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { LOG_LEVEL } from '../../../../../shared/infrastructure/logger/ILogger'
import { asyncLogMethod } from '../../../../../shared/infrastructure/logger/LoggerDecorator'
import { Customer } from '../../../domain/models/Customer'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerDTO } from '../../dtos/Customer.dto'
import { BadParametersInCustomerCreationError } from '../../errors/BadParametersInCustomerCreationError'
import { CustomerAlreadyExistsByIDError } from '../../errors/CustomerAlreadyExistsByIDError'
import { CustomerAlreadyExistsByDNINIFCIFError } from '../../errors/CustomerAlreadyExistsByNIFCIFNIEError'
import { CustomerMapper } from '../../mappers/Customer.mapper'
import { ICreateCustomerRequest, ICreateCustomerResponse, ICreateCustomerUseCase } from './ICreateCustomer.usecase'

@injectable()
export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  private buildResult(customer: Customer): CustomerDTO {
    return CustomerMapper.modelToDTO(customer)
  }

  @asyncLogMethod(LOG_LEVEL.info)
  async execute(request: ICreateCustomerRequest): Promise<ICreateCustomerResponse> {
    const customerToCreateResult = Customer.create(request)
    if (customerToCreateResult.isFail()) {
      return new BadParametersInCustomerCreationError(request)
    }
    const customer = customerToCreateResult.value()

    const customerFoundByID = await this.customerRepository.getById(customer.id)
    if (customerFoundByID) {
      return new CustomerAlreadyExistsByIDError(customer.id)
    }
    const customerFoundBYDNI = await this.customerRepository.getByNIFCIFNIE(customer.nifCifNie)
    if (customerFoundBYDNI) {
      return new CustomerAlreadyExistsByDNINIFCIFError(customer.nifCifNie)
    }

    await this.customerRepository.save(customer)

    return this.buildResult(customer)
  }
}
