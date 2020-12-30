///////////////////////////////////////////////////////////////////////////////
// NAME:            Fund.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     API model for Fund instances in the database.
//
// CREATED:         12/30/2020
//
// LAST EDITED:     12/30/2020
////

import DbObjectCollection from '../Framework/DbObjectCollection.js';
import DbObject from '../Framework/DbObject.js';
import {Validator} from '../Framework/Validator.js';
import {ApiEndpointBaseUrl} from './Common.js';

export default class Fund extends DbObject {
    static validator = new Validator({
        validators: {
            account: {
                test: object => typeof object.account === 'string'
                    && object.account !== '',
                message: 'account must be present and be a non-empty string'
            },
            description: {
                test: object => typeof object.description === 'string',
                message: 'description must be present, but can be empty'
            },
            target: {
                // TODO: This will change when formula targets are integrated
                test: object => typeof object.target === 'number',
                message: 'target must be present and be a number'
            }
        },
        forList: ['account', 'description', 'target'],
        forDetail: ['account', 'description', 'target'],
        forServer: ['url', 'id']
    });

    static collection = new DbObjectCollection(
        ApiEndpointBaseUrl + 'funds/',
        Fund.validator
    );

    constructor(object) {
        super(Fund.validator);
        Fund.validator.validate(object, {server: true});
        this.id = object.id;
        this.url = object.url;

        if (Fund.validator.validateForDetail(object)) {
            this.account = object.account;
            this.description = object.description;
            this.target = object.target;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
