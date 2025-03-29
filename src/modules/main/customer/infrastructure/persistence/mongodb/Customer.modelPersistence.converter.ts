import { ID } from 'types-ddd'

import { Customer, CustomerProps } from '../../../domain/models/Customer'
import { Address, AddressProps } from '../../../domain/models/value-objects/Address'
import { Email } from '../../../domain/models/value-objects/Email'
import { Phone } from '../../../domain/models/value-objects/Phone'
import { AddressModelPersistence, CustomerModelPersistence } from './Customer.modelPersistence'

class AddressModelPersistenceConverter {
  static modelToModelPersistence(model: Address): AddressModelPersistence {
    const mp: AddressModelPersistence = {
      street: model.street,
      number: model.number,
      city: model.city,
      state: model.state,
      postalCode: model.postalCode,
      country: model.country,
      additionalInfo: model.additionalInfo,
    }

    if (model.additionalInfo) mp.additionalInfo = model.additionalInfo

    return mp
  }

  static modelPersistenceToModel(modelPersistence: AddressModelPersistence): Address {
    const props: AddressProps = {
      street: modelPersistence.street,
      number: modelPersistence.number,
      city: modelPersistence.city,
      state: modelPersistence.state,
      postalCode: modelPersistence.postalCode,
      country: modelPersistence.country,
      additionalInfo: modelPersistence.additionalInfo,
    }

    if (modelPersistence.additionalInfo) props.additionalInfo = modelPersistence.additionalInfo

    return Address.create(props).value()
  }
}

export class CustomerModelPersistenceConverter {
  static modelToModelPersistence(model: Customer): CustomerModelPersistence {
    return {
      _id: model.id.toString(),
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email.value,
      phoneNumber: model.phoneNumber.value,
      dateOfBirth: model.dateOfBirth,
      address: AddressModelPersistenceConverter.modelToModelPersistence(model.address),
      nifCif: model.nifCif,
    }
  }

  static modelPersistenceToModel(modelPersistence: CustomerModelPersistence): Customer {
    const props: CustomerProps = {
      id: ID.create(modelPersistence._id),
      firstName: modelPersistence.firstName,
      lastName: modelPersistence.lastName,
      email: Email.create({ value: modelPersistence.email }).value(),
      phoneNumber: Phone.create({ value: modelPersistence.phoneNumber }).value(),
      dateOfBirth: modelPersistence.dateOfBirth,
      address: AddressModelPersistenceConverter.modelPersistenceToModel(modelPersistence.address),
      nifCif: modelPersistence.nifCif,
    }

    return Customer.create(props).value()
  }
}
