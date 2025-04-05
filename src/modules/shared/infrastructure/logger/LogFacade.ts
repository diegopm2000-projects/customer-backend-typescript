import { ILogger } from './ILogger'
import { MockLogger } from './/MockLogger'
import { WinstonFlatLogger } from './/WinstonFlatLogger'

export enum LOG_IMPLEMENTATION {
  MOCK = 'MOCK',
  WINSTON_FLAT = 'WINSTON_FLAT',
  WINSTON_STRUCTURED = 'WINSTON_STRUCTURED',
}

export class LogFacade {
  readonly logger: ILogger

  constructor(moduleName: string) {
    const logImplementation = process.env.APP_LOG_IMPLEMENTATION

    if (logImplementation == LOG_IMPLEMENTATION.WINSTON_FLAT) {
      this.logger = new WinstonFlatLogger({ component: moduleName })
    } else if (logImplementation == LOG_IMPLEMENTATION.MOCK) {
      this.logger = new MockLogger({ component: moduleName })
    } else {
      // eslint-disable-next-line no-console
      console.log('log implementation not found in logImplementation env Variable --> Using mockLogger as logger')
      this.logger = new MockLogger({ component: moduleName })
    }
  }

  static getInstance(moduleName: string): LogFacade {
    return new LogFacade(moduleName)
  }

  static getInstanceAndFunctionName(moduleName: string, functionName: string): { logger: ILogger; fn: string } {
    return {
      logger: new LogFacade(moduleName).logger,
      fn: functionName,
    }
  }
}
