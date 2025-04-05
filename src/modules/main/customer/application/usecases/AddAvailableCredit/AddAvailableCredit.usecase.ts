import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { LOG_LEVEL } from '../../../../../shared/infrastructure/logger/ILogger'
import { asyncLogMethod } from '../../../../../shared/infrastructure/logger/LoggerDecorator'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerNotFoundError } from '../../errors/CustomerNotFoundError'
import { CustomerMapper } from '../../mappers/Customer.mapper'
import { IAddAvailableCreditRequest, IAddAvailableCreditResponse, IAddAvailableCreditUseCase } from './IAddAvailableCredit.usecase'

@injectable()
export class AddAvailableCreditUseCase implements IAddAvailableCreditUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  @asyncLogMethod(LOG_LEVEL.info)
  async execute(request: IAddAvailableCreditRequest): Promise<IAddAvailableCreditResponse> {
    const customerFound = await this.customerRepository.getById(ID.create(request.customerId))

    if (!customerFound) {
      return new CustomerNotFoundError(ID.create(request.customerId))
    }

    customerFound.updateAvailableCredit(request.availableCredit)

    await this.customerRepository.save(customerFound)

    return CustomerMapper.modelToDTO(customerFound)
  }
}
