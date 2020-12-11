///////////////////////////////////////////////////////////////////////////////
// NAME:            Validator.test.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Test for the Validator
//
// CREATED:         12/11/2020
//
// LAST EDITED:     12/11/2020
////

import Validator from './Validator.js';

describe('The Validator cannot be constructed', () => {
    test('without validators or at least one of the for* specifiers', () => {
        const validators = {
            foo: object => object.hasOwnProperty("foo")
        };
        const forList = ['foo'];
        const forDetail = [...forList];
        const forServer = [];
        expect(() => new Validator({validators})).toThrow();
        expect(() => new Validator({forList})).toThrow();
        expect(() => new Validator({forDetail})).toThrow();
        expect(() => new Validator({forServer})).toThrow();
    });
});

describe('The Validator can be constructed', () => {
    test('using validators and one of the for* specifiers', () => {
        const validators = {
            foo: object => object.hasOwnProperty('foo')
        };
        const forList = ['foo'];
        const forDetail = [...forList];
        const forServer = [];
        expect(() => new Validator({validators, forList})).not.toThrow();
        expect(() => new Validator({validators, forDetail})).not.toThrow();
        expect(() => new Validator({validators, forServer})).not.toThrow();

        const validator = new Validator({validators, forList});
        expect(validator.forDetail).toBeNull();
    });
});

///////////////////////////////////////////////////////////////////////////////
