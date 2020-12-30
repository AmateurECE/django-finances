///////////////////////////////////////////////////////////////////////////////
// NAME:            Fund.test.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Test for the Fund API.
//
// CREATED:         12/30/2020
//
// LAST EDITED:     12/30/2020
////

import Bank from './Bank.js';
import Account from './Account.js';
import Fund from './Fund.js';
import { login } from './TestLogin.js';
import DbObject from '../Framework/DbObject.js';
import DbObjectCollection from '../Framework/DbObjectCollection.js';
import { JWTAuthenticator } from '../Framework/Authentication.js';

beforeAll(() => {
    return login().then(credentials => {
        DbObject.authenticator = new JWTAuthenticator(
            credentials.access, credentials.refresh);
        DbObjectCollection.authenticator = new JWTAuthenticator(
            credentials.access, credentials.refresh);
    }).catch(error => {throw error;});
});

describe('The Fund', () => {
    test('can be created', () => {
        return Bank.collection.create({
            name: 'ACME Bank'
        }).then(bank => {
            return Account.collection.create({
                bank: bank.url,
                name: 'My Checking',
                periodicInterestRate: 0.0025,
                accountType: 'CHECKING'
            });
        }).then(account => {
            return Fund.collection.create({
                account: account.url,
                description: 'My Sinking Fund',
                target: 3500.00
            });
        }).then(data => {
            const fund = new Fund(data);
            expect(fund).toHaveProperty('account');
            expect(fund).toHaveProperty('description');
            expect(fund.description).toBe('My Sinking Fund');
            expect(fund).toHaveProperty('target');
            expect(fund.target).toBe(3500.00);
        }).catch(error => {throw error;});
    });
});

///////////////////////////////////////////////////////////////////////////////
