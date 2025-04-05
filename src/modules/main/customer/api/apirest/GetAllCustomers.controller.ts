/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { CUSTOMER_SORT_FIELD, IGetAllCustomersRequest, IGetAllCustomersUseCase, ORDER_DIRECTION } from '../../application/usecases/GetAllCustomers/IGetAllCustomers.usecase'
import { BasePresenter } from './shared/BasePresenter'
import { InputSchemaValidator } from './shared/InputSchemaValidator'

@injectable()
export class GetAllCustomersController {
  constructor(@inject(TYPES.IGetAllCustomersUseCase) private usecase: IGetAllCustomersUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const parameters = request.query

      // Validate parameters
      const paramValidationResult = InputSchemaValidator.validateGetAllCustomersOrderingParamsInputSchema(parameters)
      if (paramValidationResult.success === false) {
        const detailedMessage = paramValidationResult.error.errors.map((err) => ({ code: err.code, message: err.message, path: err.path }))
        BasePresenter.presentBadRequestError({ request, response, detailedMessage })
        return
      }

      const { sort, order } = parameters

      const iGetAllCustomersRequest: IGetAllCustomersRequest = {}
      if (sort != undefined && order != undefined) {
        const orderingParams = {
          field: sort as CUSTOMER_SORT_FIELD,
          order: order as ORDER_DIRECTION,
        }
        iGetAllCustomersRequest.orderingParams = orderingParams
      }

      const svcResult = await this.usecase.execute(iGetAllCustomersRequest)

      BasePresenter.presentOK({ response, object: svcResult })
    } catch (error: any) {
      BasePresenter.presentInternalServerError({ request, response, error })
    }
  }
}
