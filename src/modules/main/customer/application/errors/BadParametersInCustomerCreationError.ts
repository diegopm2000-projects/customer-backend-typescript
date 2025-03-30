/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApplicationError } from '../../../../shared/application/ApplicationError'

export class BadParametersInCustomerCreationError extends ApplicationError {
  constructor(parameters: any) {
    super(`Bad parameters in customer creation: ${JSON.stringify(parameters)}`)
  }
}
