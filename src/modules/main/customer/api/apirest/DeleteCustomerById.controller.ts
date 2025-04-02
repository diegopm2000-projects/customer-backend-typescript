/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IDeleteCustomerByIdUseCase } from '../../application/usecases/DeleteCustomerById/IDeleteCustomerById.usecase'
import { InputSchemaValidator } from './shared/InputSchemaValidator'
import { BasePresenter } from './shared/BasePresenter'

@injectable()
export class DeleteCustomerByIdController {
  constructor(@inject(TYPES.IDeleteCustomerByIdUseCase) private usecase: IDeleteCustomerByIdUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const customerId = request.params.customerId
      console.log(`----> customerId: ${customerId}`)

      // Validate parameters
      const paramValidationResult = InputSchemaValidator.validateUuidInputSchema(request.params)
      if (paramValidationResult.success === false) {
        console.log(`----> paramValidationResult data: ${paramValidationResult.data}, error: ${paramValidationResult.error}`)
        const detailedMessage = paramValidationResult.error.errors.map(err => ({ code: err.code, message: err.message, path: err.path }));
        response.status(httpStatus.BAD_REQUEST).json(BasePresenter.buildBadRequest({ path: request.path, detailedMessage }))
        return
      }

      const svcResult = await this.usecase.execute({ customerId })

      if (!svcResult) {
        BasePresenter.presentObjectNotFoundError({ request, response, objectId: customerId, objectName: 'customer'})
        return
      }

      response.status(httpStatus.NO_CONTENT).json()
    } catch (error: any) {
      BasePresenter.presentInternalServerError({ request, response, error })
    }
  }
}
