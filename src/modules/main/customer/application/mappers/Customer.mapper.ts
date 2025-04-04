import { Customer } from '../../domain/models/Customer'
import { Address } from '../../domain/models/value-objects/Address'
import { AddressDTO, CustomerDTO } from '../dtos/Customer.dto'

class AddressMapper {
  static modelToDTO(model: Address): AddressDTO {
    const dto: AddressDTO = {
      street: model.street,
      number: model.number,
      city: model.city,
      state: model.state,
      postalCode: model.postalCode,
      country: model.country,
    }

    if (model.additionalInfo != undefined) dto.additionalInfo = model.additionalInfo

    return dto
  }
}

export class CustomerMapper {
  static modelToDTO(model: Customer): CustomerDTO {
    const dto: CustomerDTO = {
      id: model.id.value(),
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email.value,
      phoneNumber: model.phoneNumber.value,
      dateOfBirth: model.dateOfBirth,
      address: AddressMapper.modelToDTO(model.address),
      nifCifNie: model.nifCifNie.value,
    }

    if (model.availableCredit != undefined) dto.availableCredit = model.availableCredit.value

    return dto
  }
}
