/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../shared/infrastructure/dependencyInjection/types'
import { IGetAllCustomersUseCase } from '../../application/usecases/GetAllCustomers/IGetAllCustomers.usecase'

@injectable()
export class GetAllCustomersController {
  constructor(@inject(TYPES.IGetAllCustomersUseCase) private usecase: IGetAllCustomersUseCase) {}

  async execute(request: Request, response: Response) {
    try {
      const svcResult = await this.usecase.execute({})

      response.status(httpStatus.OK).json(svcResult)
    } catch (error: any) {
      console.error(`error.stack: ${error.stack}`)
      console.error(`error.message: ${error.message}`)

      response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server error' })
    }
  }
}
