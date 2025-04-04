import { UID } from 'types-ddd'

import { ApplicationError } from '../../../../shared/application/ApplicationError'

export class CustomerAlreadyExistsByIDError extends ApplicationError {
  constructor(id: UID) {
    super(`Customer with id: ${id.value()} already exists`)
  }
}
