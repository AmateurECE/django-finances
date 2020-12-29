///////////////////////////////////////////////////////////////////////////////
// NAME:            DbObject.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implements basic functionality for interacting with
//                  DbObjects.
//
// CREATED:         12/11/2020
//
// LAST EDITED:     12/29/2020
////

import {
    PutTransaction,
    DeleteTransaction
} from './Transaction.js';

export default class DbObject {
    // Login authenticator used by the test setup.
    static authenticator = undefined;

    constructor(validator) {
        this.validator = validator;
    }

    async save() {
        this.validator.validate(this, {detail: true});
        const transaction = new PutTransaction(
            this.url, this, DbObject.authenticator);
        return transaction.complete();
    }

    async delete() {
        this.validator.validate(this, {server: true});
        const transaction = new DeleteTransaction(
            this.url, DbObject.authenticator);
        return transaction.complete();
    }
}

///////////////////////////////////////////////////////////////////////////////
