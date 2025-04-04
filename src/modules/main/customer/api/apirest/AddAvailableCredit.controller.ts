/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IAddAvailableCreditRequest, IAddAvailableCreditUseCase } from '../../application/usecases/AddAvailableCredit/IAddAvailableCredit.usecase'
import { BasePresenter } from './shared/BasePresenter'
import { InputSchemaValidator } from './shared/InputSchemaValidator'
import { AvailableCredit } from '../../domain/models/value-objects/AvailableCredit'
import { ApplicationError } from '../../../../shared/application/ApplicationError'

@injectable()
export class AddAvailableCreditController {
  constructor(@inject(TYPES.IAddAvailableCreditUseCase) private usecase: IAddAvailableCreditUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const inputParams = {
        customerId: request.params.customerId,
        amount: request.body.amount,
      }

      // Validate input parameters
      const paramValidationResult = InputSchemaValidator.validateAddingAvailableCreditInputSchema(inputParams)
      if (paramValidationResult.success === false) {
        const detailedMessage = paramValidationResult.error.errors.map((err) => ({ message: err.message }))
        BasePresenter.presentBadRequestError({ request, response, detailedMessage })
        return
      }

      const iAddAvailableCreditRequest: IAddAvailableCreditRequest = {
        customerId: inputParams.customerId,
        availableCredit: AvailableCredit.create({ value: inputParams.amount }).value(),
      }

      const svcResult = await this.usecase.execute(iAddAvailableCreditRequest)

      if (svcResult instanceof ApplicationError) {
        BasePresenter.presentObjectNotFoundError({ request, response, objectId: inputParams.customerId, objectName: 'customer' })
        return
      }

      BasePresenter.presentOK({ response, object: svcResult })
    } catch (error: any) {
      BasePresenter.presentInternalServerError({ request, response, error })
    }
  }
}
