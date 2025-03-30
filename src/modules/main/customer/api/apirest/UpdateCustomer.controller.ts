/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ID } from 'types-ddd'
import { z } from 'zod'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { BadParametersInCustomerUpdateError } from '../../application/errors/BadParametersInCustomerUpdateError copy'
import { CustomerNotFoundError } from '../../application/errors/CustomerNotFoundError'
import { ICreateCustomerRequest } from '../../application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { IUpdateCustomerUseCase } from '../../application/usecases/UpdateCustomer/IUpdateCustomer.usecase'
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
export class UpdateCustomerController {
  constructor(@inject(TYPES.IUpdateCustomerUseCase) private usecase: IUpdateCustomerUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerParams = request.body
      console.log(`----> customerParams: ${JSON.stringify(customerParams)}`)

      // Validate input parameters
      const parametersValid = CustomerInputSchema.safeParse(customerParams)
      if (parametersValid.success === false) {
        // TODO - los http errors se pueden usar con una librería de httpStatus
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

      if (svcResult instanceof BadParametersInCustomerUpdateError) {
        response.status(400).json({ error: 'Bad Request' })
        return
      }
      if (svcResult instanceof CustomerNotFoundError) {
        response.status(404).json({ error: 'Customer not found' })
        return
      }

      response.status(201).json(svcResult)
    } catch (error: any) {
      // TODO - Ver si esto del catch lo puedo llevar al shared para no repetir (un handler allí)
      console.error(`error.stack: ${error.stack}`)
      console.error(`error.message: ${error.message}`)

      response.status(500).json({ error: 'Internal Server error' })
    }
  }
}
