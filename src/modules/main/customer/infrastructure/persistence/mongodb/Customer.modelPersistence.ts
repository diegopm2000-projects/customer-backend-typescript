export interface AddressModelPersistence {
  street: string
  number: number
  city: string
  state: string
  postalCode: string
  country: string
  additionalInfo?: string
}

export interface CustomerModelPersistence {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: Date
  address: AddressModelPersistence
  nifCif: string
}
