import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { IDeleteCustomerByIdRequest, IDeleteCustomerByIdResponse, IDeleteCustomerByIdUseCase } from './IDeleteCustomerById.usecase'

@injectable()
export class DeleteCustomerByIdUseCase implements IDeleteCustomerByIdUseCase {
  constructor(@inject(TYPES.ICustomerRepository) private customerRepository: ICustomerRepository) {}

  async execute(request: IDeleteCustomerByIdRequest): Promise<IDeleteCustomerByIdResponse> {
    const result = await this.customerRepository.deleteById(ID.create(request.customerId))

    return { result }
  }
}
