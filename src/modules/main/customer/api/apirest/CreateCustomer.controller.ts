/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { BadParametersInCustomerCreationError } from '../../application/errors/BadParametersInCustomerCreationError'
import { CustomerAlreadyExistsError } from '../../application/errors/CustomerAlreadyExistsError'
import { ICreateCustomerRequest, ICreateCustomerUseCase } from '../../application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { Address } from '../../domain/models/value-objects/Address'
import { Email } from '../../domain/models/value-objects/Email'
import { Phone } from '../../domain/models/value-objects/Phone'
import { BasePresenter } from './shared/BasePresenter'
import { InputSchemaValidator } from './shared/InputSchemaValidator'

@injectable()
export class CreateCustomerController {
  constructor(@inject(TYPES.ICreateCustomerUseCase) private usecase: ICreateCustomerUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerParams = request.body

      // Validate input parameters
      const paramValidationResult = InputSchemaValidator.validateCustomerInputSchema(customerParams)
      if (paramValidationResult.success === false) {
        const detailedMessage = paramValidationResult.error.errors.map((err) => ({ code: err.code, message: err.message, path: err.path }))
        BasePresenter.presentBadRequestError({ request, response, detailedMessage })
        return
      }

      // Prepare Request
      const createCustomerRequest: ICreateCustomerRequest = {
        id: ID.create(customerParams.id),
        firstName: customerParams.firstName,
        lastName: customerParams.lastName,
        email: Email.create({ value: customerParams.email }).value(),
        phoneNumber: Phone.create({ value: customerParams.phoneNumber }).value(),
        dateOfBirth: new Date(customerParams.dateOfBirth),
        address: Address.create(customerParams.address).value(),
        nifCif: customerParams.nifCif,
      }

      const svcResult = await this.usecase.execute(createCustomerRequest)

      if (svcResult instanceof BadParametersInCustomerCreationError) {
        const detailedMessage = [svcResult.message]
        BasePresenter.presentBadRequestError({ request, response, detailedMessage })
        return
      }
      if (svcResult instanceof CustomerAlreadyExistsError) {
        console.log(`----> svcResult: ${JSON.stringify(svcResult)}`)
        BasePresenter.presentConflictError({ request, response, message: svcResult.message })
        return
      }

      BasePresenter.presentCreated({ response, object: svcResult })
    } catch (error: any) {
      BasePresenter.presentInternalServerError({ request, response, error })
    }
  }
}
