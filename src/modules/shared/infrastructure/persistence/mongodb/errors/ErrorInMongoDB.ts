export class ErrorInMongoDB extends Error {
  constructor(method: string) {
    super(`Error in MongoDBInfra: There was an error in ${method} method`)
  }
}
