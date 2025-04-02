/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IDeleteCustomerByIdUseCase } from '../../application/usecases/DeleteCustomerById/IDeleteCustomerById.usecase'
import { BasePresenter } from './shared/BasePresenter'
import { InputSchemaValidator } from './shared/InputSchemaValidator'

@injectable()
export class DeleteCustomerByIdController {
  constructor(@inject(TYPES.IDeleteCustomerByIdUseCase) private usecase: IDeleteCustomerByIdUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerId = request.params.customerId

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

      BasePresenter.presentNoContent({ response })
    } catch (error: any) {
      BasePresenter.presentInternalServerError({ request, response, error })
    }
  }
}
