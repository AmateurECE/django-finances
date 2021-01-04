///////////////////////////////////////////////////////////////////////////////
// NAME:            Transaction.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     API Model for the Transaction object.
//
// CREATED:         01/02/2021
//
// LAST EDITED:     01/04/2021
////

import DbObject from '../Framework/DbObject.js';
import { Validator } from '../Framework/Validator.js';
import DbObjectCollection from '../Framework/DbObjectCollection.js';
import { ApiEndpointBaseUrl } from './Common.js';

export default class Transaction extends DbObject {
    static validator = new Validator({
        validators: {
            description: {
                test: object => typeof object.description === 'string',
                message: 'description may be empty, but must be a string'
            },
            amount: {
                test: object => typeof object.amount === 'number',
                message: 'amount must be present and a number'
            },
            fund: {
                test: object => typeof object.fund === 'string'
                    && object.fund !== '',
                message: 'fund must be an existing fund'
            },
            date: {
                test: object => typeof object.date === 'string',
                message: 'date must be present'
            }
        },
        forServer: ['id', 'url'],
        forList: ['description', 'amount', 'fund', 'date'],
        forDetail: ['description', 'amount', 'fund', 'date']
    });

    static collection = new DbObjectCollection(
        ApiEndpointBaseUrl + 'transactions/', Transaction.validator
    );

    constructor(object) {
        super(Transaction.validator);
        Transaction.validator.validate(object, {server: true});
        this.url = object.url;
        this.id = object.id;

        if (Transaction.validator.validateForDetail(object)) {
            this.description = object.description;
            this.amount = object.amount;
            this.fund = object.fund;
            this.date = object.date;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
