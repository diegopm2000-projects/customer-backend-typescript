/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import httpStatus from 'http-status'
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
import { InputSchemaValidator } from './shared/InputSchemaValidator'
import { PresentationErrorBuilder } from './shared/PresentationErrors'

@injectable()
export class UpdateCustomerController {
  constructor(@inject(TYPES.IUpdateCustomerUseCase) private usecase: IUpdateCustomerUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerParams = request.body
      console.log(`----> customerParams: ${JSON.stringify(customerParams)}`)

      // Validate input parameters
      const paramValidationResult = InputSchemaValidator.validateCustomerInputSchema(customerParams)
      if (paramValidationResult.success === false) {
        console.log(`----> paramValidationResult data: ${paramValidationResult.data}, error: ${paramValidationResult.error}`)
        const detailedMessage = paramValidationResult.error.errors.map(err => ({ code: err.code, message: err.message, path: err.path }));
        response.status(httpStatus.BAD_REQUEST).json(PresentationErrorBuilder.buildBadRequest({ path: request.path, detailedMessage }))
        return
      }

      console.log('----> Preparing request...')

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

      console.log('----> Calling use case...')

      const svcResult = await this.usecase.execute(createCustomerRequest)

      if (svcResult instanceof BadParametersInCustomerUpdateError) {
        const detailedMessage = [svcResult.message];
        response.status(httpStatus.BAD_REQUEST).json(PresentationErrorBuilder.buildBadRequest({ path: request.path, detailedMessage }))
      }
      if (svcResult instanceof CustomerNotFoundError) {
        response.status(httpStatus.NOT_FOUND).json(PresentationErrorBuilder.buildNotFoundError({ path: request.path, customerId: customerParams.id }))
        return
      }

      response.status(httpStatus.OK).json(svcResult)
    } catch (error: any) {
      // TODO - Ver si esto del catch lo puedo llevar al shared para no repetir (un handler allí)
      console.error(`error.stack: ${error.stack}`)
      console.error(`error.message: ${error.message}`)

      response.status(httpStatus.INTERNAL_SERVER_ERROR).json(PresentationErrorBuilder.buildInternalServerError({ path: request.path, message: error.message }))
    }
  }
}
