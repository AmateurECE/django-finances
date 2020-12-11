///////////////////////////////////////////////////////////////////////////////
// NAME:            Validator.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     This class is used to perform validation of objects against
//                  known schema.
//
// CREATED:         12/11/2020
//
// LAST EDITED:     12/11/2020
////

export class ValidationError extends Error {
    constructor(errors, ...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }

        this.name = 'ValidationError';
        this.errors = errors;
    }
}

export class Validator {
    constructor({validators, forServer, forList, forDetail}) {
        // Quickly validate this object
        if (typeof validators === 'undefined'
            || (typeof forServer === 'undefined'
                && typeof forList === 'undefined'
                && typeof forDetail === 'undefined')) {
            throw new Error('Validator expects "validators" and at least one'
                            + ' of "forServer," "forList" or "forDetail"');
        }

        this.validators = validators;
        this.forServer = forServer || null;
        this.forList = forList || null;
        this.forDetail = forDetail || null;
    }

    // Basic validation algorithm
    validateBlueprint(object, list) {
        if (list === null) {
            return {result: true};
        }

        let errors = [];
        for (let i = 0; i < this.validators.length; ++i) {
            if (!this.validators[list[i]].test(object)) {
                // TODO: Put the id in the results
                errors.push(this.validators[list[i]].message);
            }
        }

        if (errors) {
            return {result: false, errors};
        } else {
            return {result: true};
        }
    }

    // Validate for server
    validateForServer(object) {
        return this.validateBlueprint(object, this.forServer);
    }

    // Validate for list view
    validateForList(object) {
        return this.validateBlueprint(object, this.forList);
    }

    // Validate for detail view
    validateForDetail(object) {
        return this.validateBlueprint(object, this.forDetail);
    }

    validate(object, {list=false, detail=false, server=false}) {
        let detailResult, serverResult, listResult;
        if (list) {
            listResult = this.validateForList(object);
        }
        if (detail) {
            detailResult = this.validateForDetail(object);
        }
        if (server) {
            serverResult = this.validateForServer(object);
        }

        let errors = [];
        let success = true;
        for (let result in [detailResult, serverResult, listResult]) {
            if (!result.result && result.hasOwnProperty('errors')) {
                success = false;
                errors.push(...result.errors);
            }
        }

        if (!success) {
            throw new ValidationError(errors);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
