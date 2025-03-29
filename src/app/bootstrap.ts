/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-console */

import * as dotenv from 'dotenv'
import { ID } from 'types-ddd'

import { ICreateCustomerRequest, ICreateCustomerUseCase } from '../modules/main/customer/application/usecases/CreateCustomer/ICreateCustomer.usecase'
import { IGetAllCustomersUseCase } from '../modules/main/customer/application/usecases/GetAllCustomers/IGetAllCustomers.usecase'
import { IGetCustomerByIdUseCase } from '../modules/main/customer/application/usecases/GetCustomerById/IGetCustomerById.usecase'
import { CustomerProps } from '../modules/main/customer/domain/models/Customer'
import { Address, AddressProps } from '../modules/main/customer/domain/models/value-objects/Address'
import { Email } from '../modules/main/customer/domain/models/value-objects/Email'
import { Phone } from '../modules/main/customer/domain/models/value-objects/Phone'
import { TYPES } from '../modules/shared/infrastructure/dependencyInjection/types'
import { IAppConfig } from './IAppConfig'
import { App } from './app'
import { IDeleteCustomerByIdUseCase } from '../modules/main/customer/application/usecases/DeleteCustomerById/IDeleteCustomerById.usecase'

export async function init(): Promise<void> {
  dotenv.config()

  if (!process.env.MONGO_DB_URI) {
    const message = 'MONGO_DB_URI is not defined'
    console.error(message)
    throw new Error(message)
  }

  const config: IAppConfig = {
    mongodburi: process.env.MONGO_DB_URI,
  }

  const myApp = new App(config)
  myApp.start()

  // Tests integrados para probar inicialmente...
  console.log('-----------------------------------------')
  console.log('----> GET ALL CUSTOMERS...')
  console.log('-----------------------------------------')
  const customerList = await myApp.container.get<IGetAllCustomersUseCase>(TYPES.IGetAllCustomersUseCase).execute({})
  console.log(`----> result of getting all customers: ${JSON.stringify(customerList)}`)

  console.log('-----------------------------------------')
  console.log('----> GET CUSTOMER BY ID WHEN CUSTOMER IS FOUND')
  console.log('-----------------------------------------')
  const customerFound = await myApp.container.get<IGetCustomerByIdUseCase>(TYPES.IGetCustomerByIdUseCase).execute({ customerId: '706781a2-e4ee-4fc5-ab0f-fdf92f643c8a' })
  console.log(`----> result of getting customer: ${JSON.stringify(customerFound)}`)

  console.log('-----------------------------------------')
  console.log('----> GET CUSTOMER BY ID WHEN CUSTOMER IS NOT FOUND')
  console.log('-----------------------------------------')
  const customerNotFound = await myApp.container.get<IGetCustomerByIdUseCase>(TYPES.IGetCustomerByIdUseCase).execute({ customerId: '0f138fa8-d20f-4c51-ad54-bbdcef2afe8c' })
  console.log(`----> result of getting customer when is not found: ${JSON.stringify(customerNotFound)}`)

  console.log('-----------------------------------------')
  console.log('----> CREATE CUSTOMER')
  console.log('-----------------------------------------')

  const DEFAULT_EMAIL = Email.create({ value: 'mmatusalen@mail.com' }).value()
  const DEFAULT_PHONE = Phone.create({ value: '+34 666666212' }).value()
  const DEFAULT_ADDRESS_PROPS: AddressProps = {
    street: 'myStreet',
    number: 123,
    city: 'myCity',
    state: 'myState',
    postalCode: '123456',
    country: 'myCountry',
    additionalInfo: 'myAdditionalInfo',
  }
  const DEFAULT_ADDRESS = Address.create(DEFAULT_ADDRESS_PROPS).value()
  const NEW_CUSTOMER_PROPS: CustomerProps = {
    // TODO - Creo que tira con cualquier id...ver si se puede forzar a uuid
    id: ID.create('08bda2ee-c704-42ab-bf26-ad535847fc5f'),
    firstName: 'Malcolm',
    lastName: 'Matusalen',
    email: DEFAULT_EMAIL,
    phoneNumber: DEFAULT_PHONE,
    dateOfBirth: new Date('1990-01-01'),
    address: DEFAULT_ADDRESS,
    nifCif: '123456789Z',
  }

  const customerCreateRequest: ICreateCustomerRequest = NEW_CUSTOMER_PROPS

  await myApp.container.get<ICreateCustomerUseCase>(TYPES.ICreateCustomerUseCase).execute(customerCreateRequest)

  console.log('-----------------------------------------')
  console.log('----> DELETE CUSTOMER')
  console.log('-----------------------------------------')

  const deletionResult = await myApp.container.get<IDeleteCustomerByIdUseCase>(TYPES.IDeleteCustomerByIdUseCase).execute({ customerId: '08bda2ee-c704-42ab-bf26-ad535847fc5f' })
  console.log(`----> result of deleting customer: ${JSON.stringify(deletionResult)}`)

  // End the app
  await myApp.stop()
}
