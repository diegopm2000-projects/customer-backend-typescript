/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from 'zod'
import { PhoneValidatorService } from '../../../domain/services/PhoneValidator.service'
import { SpainIDValidatorService } from '../../../domain/services/SpainIDValidator.service'
import { CUSTOMER_SORT_FIELD, ORDER_DIRECTION } from '../../../application/usecases/GetAllCustomers/IGetAllCustomers.usecase'

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

const addingAvailableCreditInputSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
})

const getAllCustomersOrderingParamsInputSchema = z
  .object({
    sort: z.nativeEnum(CUSTOMER_SORT_FIELD).optional(),
    order: z.nativeEnum(ORDER_DIRECTION).optional(),
  })
  .refine(
    (data) => {
      console.log(`----> data: ${JSON.stringify(data)}`)

      const sortDefined = data.sort !== undefined && data.sort !== null
      const orderDefined = data.order !== undefined && data.order !== null

      console.log(`----> sortDefined: ${sortDefined}, orderDefined: ${orderDefined}`)

      const result = (sortDefined && orderDefined) || (!sortDefined && !orderDefined)
      console.log(`----> result de parseo: ${result}`)

      return result
    },
    {
      message: "Both 'field' and 'order' must be provided together or omitted together.",
    }
  )

export class InputSchemaValidator {
  static validateCustomerInputSchema(customerParams: any) {
    return CustomerInputSchema.safeParse(customerParams)
  }

  static validateUuidInputSchema(params: any) {
    return customerUuidSchema.safeParse(params)
  }

  static validateAddingAvailableCreditInputSchema(params: any) {
    return addingAvailableCreditInputSchema.safeParse(params)
  }

  static validateGetAllCustomersOrderingParamsInputSchema(params: any) {
    console.log(`----> params: ${JSON.stringify(params)}`)
    return getAllCustomersOrderingParamsInputSchema.safeParse(params)
  }
}
