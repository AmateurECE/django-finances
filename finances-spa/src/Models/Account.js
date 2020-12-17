///////////////////////////////////////////////////////////////////////////////
// NAME:            Account.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implementation of the Account Model for the REST API.
//
// CREATED:         12/16/2020
//
// LAST EDITED:     12/17/2020
////

import DbObjectCollection from '../Framework/DbObjectCollection.js';
import DbObject from '../Framework/DbObject.js';
import {Validator} from '../Framework/Validator.js';
import {ApiEndpointBaseUrl} from './Common.js';

export class Account extends DbObject {
    static validator = new Validator({
        validators: {
            url: {
                test: object => object.hasOwnProperty('url')
                    && object.url !== '',
                message: '"url" parameter is not present or not empty'
            },
            id: {
                test: object => object.hasOwnProperty('id')
                    && typeof object.id === 'number',
                message: '"id" parameter is not present or not a number'
            },
            name: {
                test: object => object.hasOwnProperty('name')
                    && typeof object.name === 'string',
                message: '"name" parameter is not present or not a string'
            },
            bank: {
                test: object => object.hasOwnProperty('bank')
                    && typeof object.bank === 'string' && object.bank,
                message: '"bank" parameter must be the URL of an existing bank'
            },
            periodicInterestRate: {
                test: object => object.hasOwnProperty('periodicInterestRate')
                    && typeof object.periodicInterestRate === 'number',
                message: '"periodicInterestRate" must be present and a number'
            },
            accountType: {
                test: object => object.hasOwnProperty('accountType')
                    && (object.accountType === 'CHECKING'
                        || object.accountType === 'SAVINGS'),
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

        if (Account.validate.validateForDetail(object)) {
            this.name = object.name;
            this.bank = object.bank;
            this.periodicInterestRate = object.periodicInterestRate;
            this.accountType = object.accountType;
        } else if (Account.validate.validateForList(object)) {
            this.name = object.name;
            this.bank = object.bank;
            this.accountType = object.accountType;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
