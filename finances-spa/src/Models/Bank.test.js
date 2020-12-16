///////////////////////////////////////////////////////////////////////////////
// NAME:            Bank.test.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Test module for the Bank model.
//
// CREATED:         12/12/2020
//
// LAST EDITED:     12/15/2020
////

import {Bank} from './Bank.js';

function verifyForList(bank) {
    expect(bank).toHaveProperty('id');
    expect(bank).toHaveProperty('url');
    expect(bank).toHaveProperty('name');
}

function verifyForDetail(bank) {
    verifyForList(bank);
    expect(bank).toHaveProperty('address');
    expect(bank).toHaveProperty('routingNumber');
}

describe('The Bank', () => {
    test('can be created', () => {
        return Bank.collection.create({
            name: 'ACME Bank',
            address: 'One ACME Way',
            routingNumber: '8675309'
        }).then(bank => {
            verifyForDetail(bank);
        }).catch(error => {
            throw new Error(error);
        });
    });

    test('can be retrieved', () => {
        return Bank.collection.all().then(banks => {
            expect(Array.isArray(banks)).toBe(true);
            banks.forEach(bank => {
                verifyForList(bank);
            });
        }).catch(error => {
            throw new Error(error);
        });
    });

    test('can be read by id', () => {
        return Bank.collection.all().then(data => {
            expect(data.length).toBeGreaterThanOrEqual(1);
            return Bank.collection.get({id: data[0].id});
        }).then(data => {
            verifyForDetail(data);
        }).catch(error => {
            throw new Error(error);
        });
    });

    test('can be read by url', () => {
        return Bank.collection.all().then(data => {
            expect(data.length).toBeGreaterThanOrEqual(1);
            return Bank.collection.get({url: data[0].url});
        }).then(data => {
            verifyForDetail(data);
        }).catch(error => {
            throw new Error(error);
        });
    });

    test('can be updated', () => {
        return Bank.collection.all().then(data => {
            expect(data.length).toBeGreaterThanOrEqual(1);
            return Bank.collection.get({id: data[0].id});
        }).then(data => {
            const bank = new Bank(data);
            bank.address = 'Two ACME Ways';
            return bank.save();
        }).then(data => {
            expect(data.address).toBe('Two ACME Ways');
        }).catch(error => {
            throw new Error(error);
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
            throw new Error(error);
        });
    });
});

///////////////////////////////////////////////////////////////////////////////