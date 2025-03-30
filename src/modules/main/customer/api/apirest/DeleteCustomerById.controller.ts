/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IDeleteCustomerByIdUseCase } from '../../application/usecases/DeleteCustomerById/IDeleteCustomerById.usecase'

@injectable()
export class DeleteCustomerByIdController {
  constructor(@inject(TYPES.IDeleteCustomerByIdUseCase) private usecase: IDeleteCustomerByIdUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerId = request.params.customerId
      console.log(`----> customerId: ${customerId}`)

      // Validate parameters
      const uuidSchema = z.string().uuid()
      const parametersValid = uuidSchema.safeParse(customerId)
      console.log('----> parametersValid: ', parametersValid)
      if (parametersValid.success === false) {
        response.status(400).json({ error: 'Bad Request' })
        return
      }

      const svcResult = await this.usecase.execute({ customerId })

      if (!svcResult) {
        response.status(404).json({ error: 'Customer not found' })
        return
      }

      response.status(204).json()
    } catch (error: any) {
      console.error(`error.stack: ${error.stack}`)
      console.error(`error.message: ${error.message}`)

      response.status(500).json({ error: 'Internal Server error' })
    }
  }
}
