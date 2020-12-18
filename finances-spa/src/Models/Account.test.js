///////////////////////////////////////////////////////////////////////////////
// NAME:            Account.test.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Verifies the behavior of the Application Model.
//
// CREATED:         12/16/2020
//
// LAST EDITED:     12/17/2020
////

import Bank from './Bank.js';
import Account from './Account.js';

function verifyForServer(account) {
    expect(account).toHaveProperty('id');
    expect(account).toHaveProperty('url');
    expect(account).toHaveProperty('fund_set');
}

function verifyForList(account) {
    expect(account).toHaveProperty('name');
    expect(account).toHaveProperty('bank');
    expect(account).toHaveProperty('accountType');
}

function verifyForDetail(account) {
    verifyForList(account);
    expect(account).toHaveProperty('periodicInterestRate');
}

describe('The Account', () => {
    test('can be created', () => {
        return Bank.collection.create({
            name: 'ACME Bank'
        }).then(data => {
            return Account.collection.create({
                name: 'Checking',
                bank: data.url,
                periodicInterestRate: 0.00025,
                accountType: 'CHECKING'
            });
        }).then(data => {
            const account = new Account(data);
            verifyForServer(account);
            verifyForDetail(account);
        }).catch(error => {
            throw new Error(error);
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
