import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { Customer } from '../../domain/models/Customer'
import { ICustomerRepository } from '../../domain/repositories/ICustomer.repository'
import { CustomerDTO } from '../dtos/Customer.dto'
import { CustomerMapper } from '../mappers/Customer.mapper'
import { IGetCustomerByIdRequest, IGetCustomerByIdResponse, IGetCustomerByIdUseCase } from './IGetCustomerById.usecase'

@injectable()
export class GetCustomerByIdUseCase implements IGetCustomerByIdUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  private buildResult(customer?: Customer): CustomerDTO | undefined {
    return customer ? CustomerMapper.modelToDTO(customer) : undefined
  }

  async execute(request: IGetCustomerByIdRequest): Promise<IGetCustomerByIdResponse> {
    const customer = await this.customerRepository.getById(request.customerId)

    return this.buildResult(customer)
  }
}
