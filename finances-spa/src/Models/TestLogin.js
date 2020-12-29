///////////////////////////////////////////////////////////////////////////////
// NAME:            TestLogin.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Utility for logging in as a user for the test server.
//
// CREATED:         12/27/2020
//
// LAST EDITED:     12/28/2020
////

import { PostTransaction } from '../Framework/Transaction.js';
import { ApiEndpointBaseUrl } from './Common.js';

export async function login() {
    const transaction = new PostTransaction(ApiEndpointBaseUrl + 'token/', {
        username: 'ethantwardy',
        password: '5xkx9LVbHDYJ8T7D'
    });
    return transaction.complete();
}

///////////////////////////////////////////////////////////////////////////////
