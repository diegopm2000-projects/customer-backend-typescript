import { Container } from 'inversify'

import { DependencyContainer } from '../../../src/modules/shared/infrastructure/dependencyInjection/dependencyContainer'
import { ConfigFactory } from './expectations.appConfig'

let myContainer: Container | undefined

export class ContainerFactory {
  static async getDefaultContainer(): Promise<Container> {
    if (!myContainer) {
      myContainer = await DependencyContainer.init(ConfigFactory.getDefaultConfig())
    }
    return myContainer
  }
}
