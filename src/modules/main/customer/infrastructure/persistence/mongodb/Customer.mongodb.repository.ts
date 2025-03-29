import { inject, injectable } from 'inversify'
import { Document } from 'mongodb'

import { TYPES } from '../../../../../shared/infrastructure/dependencyInjection/types'
import { IMongoDBInfra } from '../../../../../shared/infrastructure/persistence/mongodb/IMongoDBInfra'
import { Customer } from '../../../domain/models/Customer'
import { ICustomerRepository } from '../../../domain/repositories/ICustomer.repository'
import { CustomerModelPersistence } from './Customer.modelPersistence'
import { CustomerModelPersistenceConverter } from './Customer.modelPersistence.converter'

@injectable()
export class CustomerMongoDBRepository implements ICustomerRepository {
  constructor(
    @inject(TYPES.IMongoDBInfra) private mongoDBInfra: IMongoDBInfra,
    @inject(TYPES.CustomerCollection) private collection: string
  ) {}

  async getAll(): Promise<Array<Customer>> {
    const client = await this.mongoDBInfra.getConnectionDb()

    const bdObjsFound: Array<Document> = await client.collection(this.collection).find().toArray()
    return bdObjsFound.map((bdObjFound) => CustomerModelPersistenceConverter.modelPersistenceToModel(<CustomerModelPersistence>bdObjFound))
  }

  async getById(customerId: string): Promise<Customer | undefined> {
    const client = await this.mongoDBInfra.getConnectionDb()

    const bdObjFound: Document | null = await client.collection(this.collection).findOne({ _id: customerId })
    return bdObjFound ? CustomerModelPersistenceConverter.modelPersistenceToModel(<CustomerModelPersistence>bdObjFound) : undefined
  }
}
