import { ApplicationError } from '../../../../shared/application/ApplicationError'
import { SpainID } from '../../domain/models/value-objects/SpainID'

export class CustomerAlreadyExistsByDNINIFCIFError extends ApplicationError {
  constructor(nifcifnie: SpainID) {
    super(`Customer with nifcifnie: ${nifcifnie.value} already exists`)
  }
}
