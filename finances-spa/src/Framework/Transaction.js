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
// LAST EDITED:     12/09/2020
////

async function doFetch(url, method, headers, body=undefined) {
    const response = await fetch(url, {method, headers, body});
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}


export class Transaction {
    constructor(url, data=undefined) {
        this.url = url;
        this.data = data;
    }

    async complete() {
        return await this.completeFunction(this.url, this.data);
    }
}

export class GetTransaction extends Transaction {
    constructor(url) {
        super(url);
        this.completeFunction = async (url, data=undefined) => {
            return await doFetch(url, 'GET', {'Accept': 'application/json'});
        };
    }
}

export class PostTransaction extends Transaction {
    constructor(url, data) {
        super(url, data);
        this.completeFunction = async (url, data) => {
            return await doFetch(url, 'POST', {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, data);
        };
    }
}

export class PutTransaction extends Transaction {
    constructor(url, data) {
        super(url, data);
        this.completeFunction = async (url, data) => {
            return await doFetch(url, 'PUT', {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, data);
        };
    }
}

export class DeleteTransaction extends Transaction {
    constructor(url) {
        super(url);
        this.completeFunction = async (url, data=undefined) => {
            return await doFetch(url, 'DELETE', {
                'Accept': 'application/json'
            });
        };
    }
}

///////////////////////////////////////////////////////////////////////////////
