import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { LOG_LEVEL } from '../../../../../shared/infrastructure/logger/ILogger'
import { asyncLogMethod } from '../../../../../shared/infrastructure/logger/LoggerDecorator'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { IDeleteCustomerByIdRequest, IDeleteCustomerByIdResponse, IDeleteCustomerByIdUseCase } from './IDeleteCustomerById.usecase'

@injectable()
export class DeleteCustomerByIdUseCase implements IDeleteCustomerByIdUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  @asyncLogMethod(LOG_LEVEL.info)
  async execute(request: IDeleteCustomerByIdRequest): Promise<IDeleteCustomerByIdResponse> {
    return await this.customerRepository.deleteById(ID.create(request.customerId))
  }
}
