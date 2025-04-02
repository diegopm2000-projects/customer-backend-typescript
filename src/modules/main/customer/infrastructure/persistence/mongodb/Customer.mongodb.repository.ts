/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'inversify'
import { omit } from 'lodash'
import { Document, FindOneAndUpdateOptions } from 'mongodb'
import { UID } from 'types-ddd'
import { v4 } from 'uuid'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { ErrorInMongoDB } from '../../../../../shared/infrastructure/persistence/mongodb/errors/ErrorInMongoDB'
import { IMongoDBInfra } from '../../../../../shared/infrastructure/persistence/mongodb/IMongoDBInfra'
import { Customer } from '../../../domain/models/Customer'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerModelPersistence } from './Customer.modelPersistence'
import { CustomerModelPersistenceConverter } from './Customer.modelPersistence.converter'
import { SpainID } from '../../../domain/models/value-objects/SpainID'

@injectable()
export class CustomerMongoDBRepository implements ICustomerRepository {
  constructor(
    @inject(TYPES.IMongoDBInfra) private mongoDBInfra: IMongoDBInfra,
    @inject(TYPES.CustomerCollection) private collection: string
  ) {}

  private buildUpdate(data: Document) {
    const now = new Date()
    return {
      $setOnInsert: {
        _id: data._id ? data._id : v4(),
        createdAt: now,
      },
      $set: {
        ...omit(data, ['_id']),
        modifiedAt: now,
      },
    }
  }

  async getAll(): Promise<Array<Customer>> {
    const client = await this.mongoDBInfra.getConnectionDb()

    const bdObjsFound: Array<Document> = await client.collection(this.collection).find().toArray()
    return bdObjsFound.map((bdObjFound) => CustomerModelPersistenceConverter.modelPersistenceToModel(<CustomerModelPersistence>bdObjFound))
  }

  async getById(customerId: UID): Promise<Customer | undefined> {
    const client = await this.mongoDBInfra.getConnectionDb()

    const filter = { _id: customerId.value() }
    const bdObjFound: Document | null = await client.collection(this.collection).findOne(filter)
    return bdObjFound ? CustomerModelPersistenceConverter.modelPersistenceToModel(<CustomerModelPersistence>bdObjFound) : undefined
  }

  async getByNIFCIFNIE(dninifnie: SpainID): Promise<Customer | undefined> {
    const client = await this.mongoDBInfra.getConnectionDb()

    const filter = { nifCifNie: dninifnie.value }
    const bdObjFound: Document | null = await client.collection(this.collection).findOne(filter)
    return bdObjFound ? CustomerModelPersistenceConverter.modelPersistenceToModel(<CustomerModelPersistence>bdObjFound) : undefined
  }

  async save(customer: Customer): Promise<boolean> {
    const client = await this.mongoDBInfra.getConnectionDb()

    const myMP: Omit<CustomerModelPersistence, 'createdAt' | 'modifiedAt'> = CustomerModelPersistenceConverter.modelToModelPersistence(customer)

    const options: FindOneAndUpdateOptions = { upsert: true, returnDocument: 'after' }
    const filter = { _id: myMP._id }
    const { ok, value } = await client.collection(this.collection).findOneAndUpdate(filter, this.buildUpdate(myMP), options)
    if (ok != 1) {
      throw new ErrorInMongoDB('save')
    }

    return value != null
  }

  async deleteById(customerId: UID): Promise<boolean> {
    const client = await this.mongoDBInfra.getConnectionDb()

    const filter = { _id: customerId.value() }
    const { acknowledged, deletedCount } = await client.collection(this.collection).deleteOne(filter)

    if (!acknowledged) {
      throw new ErrorInMongoDB('deleteById')
    }

    return deletedCount == 1
  }
}
