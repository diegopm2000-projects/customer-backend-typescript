/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApplicationError } from '../../../../shared/application/ApplicationError'

export class BadParametersInCustomerUpdateError extends ApplicationError {
  constructor(parameters: any) {
    super(`Bad parameters in customer update: ${JSON.stringify(parameters)}`)
  }
}
