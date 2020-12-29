///////////////////////////////////////////////////////////////////////////////
// NAME:            Bank.test.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Test module for the Bank model.
//
// CREATED:         12/12/2020
//
// LAST EDITED:     12/29/2020
////

import Bank from './Bank.js';
import { login } from './TestLogin.js';
import DbObject from '../Framework/DbObject.js';
import DbObjectCollection from '../Framework/DbObjectCollection.js';
import { JWTAuthenticator } from '../Framework/Authentication.js';

function verifyForList(bank) {
    expect(bank).toHaveProperty('id');
    expect(bank).toHaveProperty('url');
    expect(bank).toHaveProperty('name');
}

beforeAll(() => {
    return login().then(credentials => {
        DbObject.authenticator = new JWTAuthenticator(
            credentials.access, credentials.refresh);
        DbObjectCollection.authenticator = new JWTAuthenticator(
            credentials.access, credentials.refresh);
    }).catch(error => {throw error;});
});

describe('The Bank', () => {
    test('can be created', () => {
        return Bank.collection.create({
            name: 'ACME Bank'
        }).then(bank => {
            verifyForList(bank);
        }).catch(error => {
            throw error;
        });
    });

    test('can be retrieved', () => {
        return Bank.collection.all().then(banks => {
            expect(Array.isArray(banks)).toBe(true);
            banks.forEach(bank => {
                verifyForList(bank);
            });
        }).catch(error => {
            throw error;
        });
    });

    test('can be read by id', () => {
        return Bank.collection.all().then(data => {
            expect(data.length).toBeGreaterThanOrEqual(1);
            return Bank.collection.get({id: data[0].id});
        }).then(data => {
            verifyForList(data);
        }).catch(error => {
            throw error;
        });
    });

    test('can be read by url', () => {
        return Bank.collection.all().then(data => {
            expect(data.length).toBeGreaterThanOrEqual(1);
            return Bank.collection.get({url: data[0].url});
        }).then(data => {
            verifyForList(data);
        }).catch(error => {
            throw error;
        });
    });

    test('can be updated', () => {
        return Bank.collection.all().then(data => {
            expect(data.length).toBeGreaterThanOrEqual(1);
            return Bank.collection.get({id: data[0].id});
        }).then(data => {
            const bank = new Bank(data);
            bank.name = 'Coyote Bank';
            return bank.save();
        }).then(data => {
            expect(data.name).toBe('Coyote Bank');
        }).catch(error => {
            throw error;
        });
    });

    test('can be deleted', () => {
        return Bank.collection.all().then(data => {
            expect(data.length).toBeGreaterThanOrEqual(1);
            return Bank.collection.get({id: data[0].id});
        }).then(data => {
            const bank = new Bank(data);
            return bank.delete();
        }).catch(error => {
            throw error;
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
