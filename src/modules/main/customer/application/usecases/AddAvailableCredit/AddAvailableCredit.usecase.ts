import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerNotFoundError } from '../../errors/CustomerNotFoundError'
import { IAddAvailableCreditRequest, IAddAvailableCreditResponse, IAddAvailableCreditUseCase } from './IAddAvailableCredit.usecase'

@injectable()
export class AddAvailableCreditUseCase implements IAddAvailableCreditUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  async execute(request: IAddAvailableCreditRequest): Promise<IAddAvailableCreditResponse> {
    console.log(`----> request: ${JSON.stringify(request)}`)

    const customerFound = await this.customerRepository.getById(ID.create(request.customerId))
    console.log(`----> customer found: ${JSON.stringify(customerFound)}`)

    if (!customerFound) {
      return new CustomerNotFoundError(ID.create(request.customerId))
    }

    console.log(`----> availableCredit en el usecase: ${JSON.stringify(request.availableCredit)}`)

    customerFound.updateAvailableCredit(request.availableCredit)

    console.log(`----> customer with available credit updated: ${JSON.stringify(customerFound)}`)

    await this.customerRepository.save(customerFound)

    return true
  }
}
