/* eslint-disable no-console */

import * as dotenv from 'dotenv'
import { IAppConfig } from './IAppConfig'
import { App } from './app'
import { IGetAllCustomersUseCase } from '../modules/main/customer/usecases/GetAllCustomers/IGetAllCustomers.usecase'
import { TYPES } from '../modules/shared/infrastructure/dependencyInjection/types'
import { IGetCustomerByIdUseCase } from '../modules/main/customer/usecases/GetCustomerById/IGetCustomerById.usecase'

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

  // Tests integrados
  const customerList = await myApp.container.get<IGetAllCustomersUseCase>(TYPES.IGetAllCustomersUseCase).execute({})
  console.log(`----> result of getting all customers: ${JSON.stringify(customerList)}`)

  const customerFound = await myApp.container.get<IGetCustomerByIdUseCase>(TYPES.IGetCustomerByIdUseCase).execute({ customerId: '706781a2-e4ee-4fc5-ab0f-fdf92f643c8a' })
  console.log(`----> result of getting customer: ${JSON.stringify(customerFound)}`)

  const customerNotFound = await myApp.container.get<IGetCustomerByIdUseCase>(TYPES.IGetCustomerByIdUseCase).execute({ customerId: 'nonsense' })
  console.log(`----> result of getting customer: ${JSON.stringify(customerNotFound)}`)

  // End the app
  await myApp.stop()
}
