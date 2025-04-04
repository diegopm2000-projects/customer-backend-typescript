/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status'

import { Request, Response } from 'express'

interface PresentationError {
  status: number
  error: string
  message: string
  details?: Array<any>
  path: string
  timestamp: Date
}

export const BAD_REQUEST_INPUT_PARAMETERS_MESSAGE = 'Input parameters not valid'

export const BAD_REQUEST_ERROR = 'Bad request'
export const OBJECT_NOT_FOUND_ERROR = 'Object not found'
export const CONFLICT_ERROR = 'Conflict'
export const INTERNAL_SERVER_ERROR = 'Internal server error'

export class BasePresenter {
  static buildJSONBadRequestError(params: { path: string; detailedMessage: Array<any> }): PresentationError {
    const { path, detailedMessage } = params
    return {
      status: httpStatus.BAD_REQUEST,
      error: BAD_REQUEST_ERROR,
      message: BAD_REQUEST_INPUT_PARAMETERS_MESSAGE,
      details: detailedMessage,
      path,
      timestamp: new Date(),
    }
  }
  private static buildJSONNotFoundError(params: { path: string; objectId: string; objectName: string }): PresentationError {
    const { path, objectId, objectName } = params
    return {
      status: httpStatus.NOT_FOUND,
      error: OBJECT_NOT_FOUND_ERROR,
      message: `The ${objectName} with id: ${objectId} was not found in the system`,
      path,
      timestamp: new Date(),
    }
  }

  private static buildJSONConflictError(params: { path: string; message: string }): PresentationError {
    const { path, message } = params
    return {
      status: httpStatus.CONFLICT,
      error: CONFLICT_ERROR,
      message,
      path,
      timestamp: new Date(),
    }
  }

  private static buildJSONInternalServerError(params: { path: string; message: string }): PresentationError {
    const { path, message } = params
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: INTERNAL_SERVER_ERROR,
      message,
      path,
      timestamp: new Date(),
    }
  }

  static presentInternalServerError(params: { request: Request; response: Response; error: Error }) {
    const { request, response, error } = params

    console.error(`error.stack: ${error.stack}`)
    console.error(`error.message: ${error.message}`)

    response.status(httpStatus.INTERNAL_SERVER_ERROR).json(BasePresenter.buildJSONInternalServerError({ path: request.path, message: error.message }))
  }

  static presentObjectNotFoundError(params: { request: Request; response: Response; objectId: string; objectName: string }) {
    const { request, response, objectId, objectName } = params

    response.status(httpStatus.NOT_FOUND).json(BasePresenter.buildJSONNotFoundError({ path: request.path, objectId, objectName }))
  }

  static presentConflictError(params: { request: Request; response: Response; message: string }) {
    const { request, response, message } = params

    response.status(httpStatus.CONFLICT).json(BasePresenter.buildJSONConflictError({ path: request.path, message }))
  }

  static presentBadRequestError(params: { request: Request; response: Response; detailedMessage: Array<any> }) {
    const { request, response, detailedMessage } = params

    response.status(httpStatus.BAD_REQUEST).json(BasePresenter.buildJSONBadRequestError({ path: request.path, detailedMessage }))
  }

  static presentOK(params: { response: Response; object: any }) {
    const { response, object } = params

    response.status(httpStatus.OK).json(object)
  }

  static presentCreated(params: { response: Response; object: any }) {
    const { response, object } = params

    response.status(httpStatus.CREATED).json(object)
  }

  static presentNoContent(params: { response: Response }) {
    const { response } = params

    response.status(httpStatus.NO_CONTENT).json()
  }
}
