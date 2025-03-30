/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, injectable } from 'inversify'
import { Request, Response } from 'express'
import { z } from 'zod'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IGetCustomerByIdUseCase } from '../../application/usecases/GetCustomerById/IGetCustomerById.usecase'

@injectable()
export class GetCustomerByIdController {
  constructor(@inject(TYPES.IGetCustomerByIdUseCase) private usecase: IGetCustomerByIdUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerId = request.params.customerId
      console.log(`----> customerId: ${customerId}`)

      // Validate parameters
      const uuidSchema = z.string().uuid()
      const parametersValid = uuidSchema.safeParse(customerId)
      if (parametersValid.success === false) {
        response.status(400).json({ error: 'Bad Request' })
        return
      }

      const svcResult = await this.usecase.execute({ customerId })

      if (!svcResult) {
        response.status(404).json({ error: 'Customer not found' })
        return
      }

      response.status(200).json(svcResult)
    } catch (error: any) {
      console.error(`error.stack: ${error.stack}`)
      console.error(`error.message: ${error.message}`)

      response.status(500).json({ error: 'Internal Server error' })
    }
  }
}
