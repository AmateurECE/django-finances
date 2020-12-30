///////////////////////////////////////////////////////////////////////////////
// NAME:            Account.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implementation of the Account Model for the REST API.
//
// CREATED:         12/16/2020
//
// LAST EDITED:     12/30/2020
////

import DbObjectCollection from '../Framework/DbObjectCollection.js';
import DbObject from '../Framework/DbObject.js';
import {Validator} from '../Framework/Validator.js';
import {ApiEndpointBaseUrl} from './Common.js';

export default class Account extends DbObject {
    static validator = new Validator({
        validators: {
            url: {
                test: obj => obj.url !== '',
                message: '"url" parameter is not present or not empty'
            },
            id: {
                test: obj => typeof obj.id === 'number',
                message: '"id" parameter is not present or not a number'
            },
            name: {
                test: obj => typeof obj.name === 'string',
                message: '"name" parameter is not present or not a string'
            },
            bank: {
                test: obj => typeof obj.bank === 'string' && obj.bank,
                message: '"bank" parameter must be the URL of an existing bank'
            },
            periodicInterestRate: {
                test: obj => typeof obj.periodicInterestRate === 'number',
                message: '"periodicInterestRate" must be present and a number'
            },
            accountType: {
                test: obj => obj.accountType === 'CHECKING'
                    || obj.accountType === 'SAVINGS',
                message: '"accountType" must either be "SAVINGS" or "CHECKING"'
            }
        },
        forList: ['name', 'bank',  'periodicInterestRate', 'accountType'],
        forDetail: ['name', 'bank', 'periodicInterestRate', 'accountType'],
        forServer: ['url', 'id']
    });

    static collection = new DbObjectCollection(
        ApiEndpointBaseUrl + 'accounts/',
        Account.validator
    );

    constructor(object) {
        super(Account.validator);
        Account.validator.validate(object, {server: true});
        this.url = object.url;
        this.id = object.id;

        if (Account.validator.validateForDetail(object)) {
            this.name = object.name;
            this.bank = object.bank;
            this.periodicInterestRate = object.periodicInterestRate;
            this.accountType = object.accountType;
        } else if (Account.validator.validateForList(object)) {
            this.name = object.name;
            this.bank = object.bank;
            this.accountType = object.accountType;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
