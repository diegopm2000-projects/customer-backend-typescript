/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from 'zod'
import { PhoneValidatorService } from '../../../domain/services/PhoneValidator.service'
import { SpainIDValidatorService } from '../../../domain/services/SpainIDValidator.service'

const AddressInputSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
})

const CustomerInputSchema = z
  .object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    dateOfBirth: z.string().datetime(), // ISO 8601
    address: AddressInputSchema,
    nifCifNie: z.string(),
  })
  .refine(
    (data) => {
      return PhoneValidatorService.isValid(data.phoneNumber)
    },
    {
      message: 'Invalid phone number',
    }
  )
  .refine(
    (data) => {
      return SpainIDValidatorService.isValid(data.nifCifNie)
    },
    {
      message: 'Invalid nifCifNie',
    }
  )

const customerUuidSchema = z.object({
  customerId: z.string().uuid(),
})

export class InputSchemaValidator {
  static validateCustomerInputSchema(customerParams: any) {
    return CustomerInputSchema.safeParse(customerParams)
  }

  static validateUuidInputSchema(params: any) {
    return customerUuidSchema.safeParse(params)
  }
}
