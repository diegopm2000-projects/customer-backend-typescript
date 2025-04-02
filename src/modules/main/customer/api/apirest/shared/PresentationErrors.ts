import httpStatus from 'http-status'

import { ApplicationError } from "../../../../../shared/application/ApplicationError";

interface PresentationError {
    status: number
    error: string
    message: string
    details?: Array<any>
    path: string
    timestamp: Date
}

const OBJECT_NAME = 'customer'

export const BAD_REQUEST_INPUT_PARAMETERS_MESSAGE = 'Input parameters not valid'

export const BAD_REQUEST_ERROR = 'Bad request'
export const OBJECT_NOT_FOUND_ERROR = 'Object not found'
export const CONFLICT_ERROR = 'Conflict'
export const INTERNAL_SERVER_ERROR = 'Internal server error'

export class PresentationErrorBuilder {
    static buildBadRequest(params: { path: string; detailedMessage: Array<any> }): PresentationError {
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
    static buildNotFoundError(params: { path: string; customerId: string }): PresentationError  {
        const { path, customerId } = params
        return {
            status: httpStatus.NOT_FOUND,
            error: OBJECT_NOT_FOUND_ERROR,
            message: `The ${OBJECT_NAME} with id: ${customerId} was not found in the system`,
            path,
            timestamp: new Date(),
        }
    }

    static buildInternalServerError(params: { path: string; message: string }): PresentationError {
        const { path, message } = params
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            error: INTERNAL_SERVER_ERROR,
            message,
            path,
            timestamp: new Date(),
        }
    }

    static buildConflictError(params: { path: string; message: string }): PresentationError {
        const { path, message } = params
        return {
            status: httpStatus.CONFLICT,
            error: CONFLICT_ERROR,
            message,
            path,
            timestamp: new Date(),
        }
    }
}