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

    if (model.additionalInfo) dto.additionalInfo = model.additionalInfo

    return dto
  }
}

export class CustomerMapper {
  static modelToDTO(customer: Customer): CustomerDTO {
    return {
      id: customer.id.value(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email.value,
      phoneNumber: customer.phoneNumber.value,
      dateOfBirth: customer.dateOfBirth,
      address: AddressMapper.modelToDTO(customer.address),
      nifCif: customer.nifCif,
    }
  }
}
