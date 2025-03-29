/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'
import { z } from 'zod'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { BadParametersInCustomerCreationError } from '../../application/errors/BadParametersInCustomerCreationError'
import { CustomerAlreadyExistsError } from '../../application/errors/CustomerAlreadyExistsError'
import { ICreateCustomerRequest, ICreateCustomerUseCase } from '../../application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { Address } from '../../domain/models/value-objects/Address'
import { Email } from '../../domain/models/value-objects/Email'
import { Phone } from '../../domain/models/value-objects/Phone'

// TODO - Pasar estos schemas a un shared.ts para no repetir

const AddressInputSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
})

const CustomerInputSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(), // TODO - Usar refine para validar esto también
  dateOfBirth: z.string().datetime(), // ISO 8601
  address: AddressInputSchema,
  nifCif: z.string(),
})

@injectable()
export class CreateCustomerController {
  constructor(@inject(TYPES.ICreateCustomerUseCase) private usecase: ICreateCustomerUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerParams = request.body
      console.log(`----> customerParams: ${JSON.stringify(customerParams)}`)

      // Validate input parameters
      const parametersValid = CustomerInputSchema.safeParse(customerParams)
      if (parametersValid.success === false) {
        response.status(400).json({ error: 'Bad Request' })
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
        response.status(400).json({ error: 'Bad Request' })
        return
      }
      if (svcResult instanceof CustomerAlreadyExistsError) {
        response.status(409).json({ error: 'Customer already exists' })
        return
      }

      response.status(201).json(svcResult)
    } catch (error: any) {
      console.error(`error.stack: ${error.stack}`)
      console.error(`error.message: ${error.message}`)

      response.status(500).json({ error: 'Internal Server error' })
    }
  }
}
