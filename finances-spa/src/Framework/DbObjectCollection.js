///////////////////////////////////////////////////////////////////////////////
// NAME:            DbObjectCollection.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implements a basic interface for dealing with Collections
//                  of data in the database
//
// CREATED:         12/09/2020
//
// LAST EDITED:     12/29/2020
////

import {
    GetTransaction,
    PostTransaction
} from './Transaction.js';

export default class DbObjectCollection {
    // Authenticator used for testing. Set by the test setup methods.
    static authenticator = undefined;

    constructor(url, validator) {
        this.url = url;
        this.validator = validator;
    }

    // Create the Object in the Server database
    async create(query) {
        // Validate the query for detail & server
        this.validator.validate(query, {detail: true, server: true});

        // Initiate POST
        const transaction = new PostTransaction(
            this.url, query, DbObjectCollection.authenticator);
        return transaction.complete();
    }

    // Get the Object with the URL or id provided ('Detail View')
    async get({id, url}) {
        // Ensure either id or url is specified
        let objectUrl;
        if (typeof id !== 'undefined') {
            if (typeof id === 'number') {
                objectUrl = this.url + id.toString() + '/';
            } else if (typeof id === 'string') {
                objectUrl = this.url + id + '/';
            }
        } else if (typeof url !== 'undefined') {
            objectUrl = url;
        } else {
            throw new Error('Either "id" or "url" must be specified for GET');
        }

        // Initiate GET
        const transaction = new GetTransaction(
            objectUrl, DbObjectCollection.authenticator);
        return transaction.complete();
    }

    // Get all Object objects available to this client. This is a 'List View'
    async all() {
        return new GetTransaction(
            this.url, DbObjectCollection.authenticator).complete();
    }
}

///////////////////////////////////////////////////////////////////////////////
