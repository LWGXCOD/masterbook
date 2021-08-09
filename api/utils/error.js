const httpStatusCodes = require('../httpStatusCodes')

class BaseError extends Error {
    constructor(name, data, statusCode, isOperational, description) {
        super(description)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = name
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.data = data
        Error.captureStackTrace(this)
    }
}

class Api404Error extends BaseError {
    constructor(
        name,
        data = null,
        statusCode = httpStatusCodes.NOT_FOUND,
        description = 'Not found.',
        isOperational = true
    ) {
        super(name, data, statusCode, isOperational, description)
    }
}

class Api410Error extends BaseError {
    constructor(
        name,
        data = null,
        statusCode = httpStatusCodes.GONE,
        description = 'Gone.',
        isOperational = true
    ) {
        super(name, data, statusCode, isOperational, description)
    }
}

class Api400Error extends BaseError {
    constructor(
        name,
        data = null,
        statusCode = httpStatusCodes.BAD_REQUEST,
        description = 'Client error',
        isOperational = true
    ) {
        super(name, data, statusCode, isOperational, description)
    }
}

module.exports = {Error, Api404Error, Api400Error}