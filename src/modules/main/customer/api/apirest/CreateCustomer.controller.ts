/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { BadParametersInCustomerCreationError } from '../../application/errors/BadParametersInCustomerCreationError'
import { CustomerAlreadyExistsError } from '../../application/errors/CustomerAlreadyExistsError'
import { ICreateCustomerRequest, ICreateCustomerUseCase } from '../../application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { Address } from '../../domain/models/value-objects/Address'
import { Email } from '../../domain/models/value-objects/Email'
import { Phone } from '../../domain/models/value-objects/Phone'
import { validateCustomerInputSchema } from './shared'

@injectable()
export class CreateCustomerController {
  constructor(@inject(TYPES.ICreateCustomerUseCase) private usecase: ICreateCustomerUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerParams = request.body
      console.log(`----> customerParams: ${JSON.stringify(customerParams)}`)

      // Validate input parameters
      const parametersValid = validateCustomerInputSchema(customerParams)
      if (parametersValid.success === false) {
        response.status(httpStatus.BAD_REQUEST).json({ error: 'Bad Request' })
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

      if (svcResult instanceof BadParametersInCustomerCreationError) {
        response.status(httpStatus.BAD_REQUEST).json({ error: 'Bad Request' })
        return
      }
      if (svcResult instanceof CustomerAlreadyExistsError) {
        response.status(httpStatus.CONFLICT).json({ error: 'Customer already exists' })
        return
      }

      response.status(httpStatus.CREATED).json(svcResult)
    } catch (error: any) {
      console.error(`error.stack: ${error.stack}`)
      console.error(`error.message: ${error.message}`)

      response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server error' })
    }
  }
}
