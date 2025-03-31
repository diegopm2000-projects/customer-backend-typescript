/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IGetCustomerByIdUseCase } from '../../application/usecases/GetCustomerById/IGetCustomerById.usecase'
import { InputSchemaValidator } from './shared/InputSchemaValidator'

@injectable()
export class GetCustomerByIdController {
  constructor(@inject(TYPES.IGetCustomerByIdUseCase) private usecase: IGetCustomerByIdUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerId = request.params.customerId
      console.log(`----> customerId: ${customerId}`)

      // Validate parameters
      const parametersValid = InputSchemaValidator.validateUuidInputSchema(customerId)
      if (parametersValid.success === false) {
        response.status(httpStatus.BAD_REQUEST).json({ error: 'Bad Request' })
        return
      }

      const svcResult = await this.usecase.execute({ customerId })

      if (!svcResult) {
        response.status(httpStatus.NOT_FOUND).json({ error: 'Customer not found' })
        return
      }

      response.status(httpStatus.OK).json(svcResult)
    } catch (error: any) {
      console.error(`error.stack: ${error.stack}`)
      console.error(`error.message: ${error.message}`)

      response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server error' })
    }
  }
}
