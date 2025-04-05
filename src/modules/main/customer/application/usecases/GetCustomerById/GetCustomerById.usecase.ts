import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { Customer } from '../../../domain/models/Customer'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerDTO } from '../../dtos/Customer.dto'
import { CustomerMapper } from '../../mappers/Customer.mapper'
import { IGetCustomerByIdRequest, IGetCustomerByIdResponse, IGetCustomerByIdUseCase } from './IGetCustomerById.usecase'
import { asyncLogMethod } from '../../../../../shared/infrastructure/logger/LoggerDecorator'
import { LOG_LEVEL } from '../../../../../shared/infrastructure/logger/ILogger'

@injectable()
export class GetCustomerByIdUseCase implements IGetCustomerByIdUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  private buildResult(customer?: Customer): CustomerDTO | undefined {
    return customer ? CustomerMapper.modelToDTO(customer) : undefined
  }

  @asyncLogMethod(LOG_LEVEL.info)
  async execute(request: IGetCustomerByIdRequest): Promise<IGetCustomerByIdResponse> {
    const customer = await this.customerRepository.getById(ID.create(request.customerId))

    return this.buildResult(customer)
  }
}
