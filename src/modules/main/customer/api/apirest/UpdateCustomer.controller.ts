/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { BadParametersInCustomerUpdateError } from '../../application/errors/BadParametersInCustomerUpdateError copy'
import { CustomerNotFoundError } from '../../application/errors/CustomerNotFoundError'
import { ICreateCustomerRequest } from '../../application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { IUpdateCustomerUseCase } from '../../application/usecases/UpdateCustomer/IUpdateCustomer.usecase'
import { Address } from '../../domain/models/value-objects/Address'
import { Email } from '../../domain/models/value-objects/Email'
import { Phone } from '../../domain/models/value-objects/Phone'
import { SpainID } from '../../domain/models/value-objects/SpainID'
import { BasePresenter } from './shared/BasePresenter'
import { InputSchemaValidator } from './shared/InputSchemaValidator'

@injectable()
export class UpdateCustomerController {
  constructor(@inject(TYPES.IUpdateCustomerUseCase) private usecase: IUpdateCustomerUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerParams = request.body

      // Validate input parameters
      const paramValidationResult = InputSchemaValidator.validateCustomerInputSchema(customerParams)
      if (paramValidationResult.success === false) {
        const detailedMessage = paramValidationResult.error.errors.map((err) => ({ message: err.message }))
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
        nifCifNie: SpainID.create({ value: customerParams.nifCifNie }).value(),
      }

      const svcResult = await this.usecase.execute(createCustomerRequest)

      if (svcResult instanceof BadParametersInCustomerUpdateError) {
        const detailedMessage = [svcResult.message]
        BasePresenter.presentBadRequestError({ request, response, detailedMessage })
        return
      }
      if (svcResult instanceof CustomerNotFoundError) {
        BasePresenter.presentObjectNotFoundError({ request, response, objectId: customerParams.id, objectName: 'customer' })
        return
      }

      BasePresenter.presentOK({ response, object: svcResult })
    } catch (error: any) {
      BasePresenter.presentInternalServerError({ request, response, error })
    }
  }
}
