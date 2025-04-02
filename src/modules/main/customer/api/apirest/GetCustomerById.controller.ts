/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IGetCustomerByIdUseCase } from '../../application/usecases/GetCustomerById/IGetCustomerById.usecase'
import { BasePresenter } from './shared/BasePresenter'
import { InputSchemaValidator } from './shared/InputSchemaValidator'

@injectable()
export class GetCustomerByIdController {
  constructor(@inject(TYPES.IGetCustomerByIdUseCase) private usecase: IGetCustomerByIdUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerId = request.params.customerId
      console.log(`----> customerId: ${customerId}`)

      // Validate parameters
      const paramValidationResult = InputSchemaValidator.validateUuidInputSchema(request.params)
      if (paramValidationResult.success === false) {
        const detailedMessage = paramValidationResult.error.errors.map((err) => ({ code: err.code, message: err.message, path: err.path }))
        BasePresenter.presentBadRequestError({ request, response, detailedMessage })
        return
      }

      const svcResult = await this.usecase.execute({ customerId })

      if (!svcResult) {
        BasePresenter.presentObjectNotFoundError({ request, response, objectId: customerId, objectName: 'customer' })
        return
      }

      BasePresenter.presentOK({ response, object: svcResult })
    } catch (error: any) {
      BasePresenter.presentInternalServerError({ request, response, error })
    }
  }
}
