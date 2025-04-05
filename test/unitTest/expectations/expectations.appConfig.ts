import { IAppConfig } from '../../../src/app/IAppConfig'

export class ConfigFactory {
  static getDefaultConfig(): IAppConfig {
    return {
      mongodburi: 'mongodb://localhost:27017',
      expressPort: 3000,
      appLogLevel: 'info',
      appLogImplementation: 'MOCK',
    }
  }
}
