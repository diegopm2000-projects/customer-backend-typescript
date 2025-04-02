export interface AddressDTO {
  street: string
  number: number
  city: string
  state: string
  postalCode: string
  country: string
  additionalInfo?: string
}

export interface CustomerDTO {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: Date
  address: AddressDTO
  nifCifNie: string
}
