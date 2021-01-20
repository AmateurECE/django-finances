///////////////////////////////////////////////////////////////////////////////
// NAME:            Transaction.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Class abstracting REST transactions to remove the logic for
//                  completing them from the Model classes.
//
// CREATED:         12/07/2020
//
// LAST EDITED:     01/05/2021
////

import fetch from 'node-fetch';
import { CSRFAuthenticator } from './Authentication.js';

async function doFetch(url, method, headers, body=undefined) {
    const response = await fetch(url, {body: JSON.stringify(body), method,
                                       headers});
    if (!response.ok) {
        const error = new Error(response.statusText);
        error.number = response.status;
        throw error;
    }

    if (method !== 'DELETE') {
        return await response.json();
    } else {
        return {};
    }
}


class Transaction {
    constructor(url, data=undefined, authenticator=undefined) {
        this.url = url;
        this.data = data;
        this.authenticator = authenticator;
    }

    async complete() {
        return await this.completeFunction(
            this.url, this.data, this.authenticator);
    }
}

export class GetTransaction extends Transaction {
    constructor(url, authenticator=undefined) {
        super(url, undefined, authenticator);
        this.completeFunction =
            async (url, data=undefined, authenticator=undefined) => {
                let headers = {'Accept': 'application/json'};
                if (typeof authenticator !== 'undefined') {
                    authenticator.installHeader(headers);
                }
                return await doFetch(
                    url, 'GET', headers);
            };
    }
}

export class PostTransaction extends Transaction {
    constructor(url, data, authenticator=new CSRFAuthenticator()) {
        super(url, data, authenticator);
        this.completeFunction = async (url, data, authenticator) => {
            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            authenticator.installHeader(headers);
            return await doFetch(url, 'POST', headers, data);
        };
    }
}

export class PutTransaction extends Transaction {
    constructor(url, data, authenticator=new CSRFAuthenticator()) {
        super(url, data, authenticator);
        this.completeFunction = async (url, data, authenticator) => {
            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            authenticator.installHeader(headers);
            return await doFetch(url, 'PUT', headers, data);
        };
    }
}

export class DeleteTransaction extends Transaction {
    constructor(url, authenticator=new CSRFAuthenticator()) {
        // This is bad form, but Transaction is not exported.
        super(url, undefined, authenticator);
        this.completeFunction =
            async (url, data=undefined, authenticator=undefined) => {
                let headers = {};
                authenticator.installHeader(headers);
                return await doFetch(url, 'DELETE', headers);
            };
    }
}

///////////////////////////////////////////////////////////////////////////////
