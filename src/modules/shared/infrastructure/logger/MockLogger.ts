/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CompleteLogParameters, ILogger, LogParameters } from './ILogger'

export class MockLogger implements ILogger {
  constructor(defaultMeta: any) {
    // nothing to do
  }
  public log(params: CompleteLogParameters): void {
    // nothing to do
  }

  public debug(params: LogParameters): void {
    // nothing to do
  }

  public info(params: LogParameters): void {
    // nothing to do
  }

  public warn(params: LogParameters): void {
    // nothing to do
  }

  public error(params: LogParameters): void {
    // nothing to do
  }
}
