/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IGetCustomerByIdUseCase } from '../../application/usecases/GetCustomerById/IGetCustomerById.usecase'
import { InputSchemaValidator } from './shared/InputSchemaValidator'
import { BasePresenter } from './shared/BasePresenter'

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

      response.status(httpStatus.OK).json(svcResult)
    } catch (error: any) {
      BasePresenter.presentInternalServerError({ request, response, error })
    }
  }
}
