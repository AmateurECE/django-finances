///////////////////////////////////////////////////////////////////////////////
// NAME:            Bank.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implements a POJO interface for the Bank endpoints of the
//                  REST API.
//
// CREATED:         12/09/2020
//
// LAST EDITED:     12/12/2020
////

import DbObjectCollection from '../Framework/DbObjectCollection.js';
import DbObject from '../Framework/DbObject.js';
import {Validator} from '../Framework/Validator.js';
import {ApiEndpointBaseUrl} from './Common.js';

export class Bank extends DbObject {
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
                message: 'Required parameter "name" must be a string'
            },
            address: {
                test: object => object.hasOwnProperty('address')
                    && typeof object.address === 'string',
                message: 'Required parameter "address" must be a string'
            },
            routingNumber: {
                test: object => object.hasOwnProperty('routingNumber')
                    && typeof object.routingNumber === 'string',
                message: 'Required parameter "routingNumber" must be a string'
            }
        },
        forList: ['name'],
        forDetail: ['name', 'address', 'routingNumber'],
        forServer: ['url', 'id']
    });

    static collection = new DbObjectCollection(ApiEndpointBaseUrl + 'banks/',
                                               Bank.validator);

    constructor(object) {
        super(Bank.validator);

        Bank.validator.validate(object, {server: true});
        this.url = object.url;
        this.id = object.id;

        if (Bank.validator.validateForDetail(object)) {
            this.name = object.name;
            this.address = object.address;
            this.routingNumber = object.routingNumber;
        } else if (Bank.validator.validateForList(object)) {
            this.name = object.name;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
