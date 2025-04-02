/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from 'zod'

const AddressInputSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
})

const CustomerInputSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(), // TODO - Usar refine para validar esto también
  dateOfBirth: z.string().datetime(), // ISO 8601
  address: AddressInputSchema,
  nifCif: z.string(),
})

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
