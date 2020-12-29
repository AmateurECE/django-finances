///////////////////////////////////////////////////////////////////////////////
// NAME:            Authentication.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Some useful classes for handling REST authentication.
//
// CREATED:         12/28/2020
//
// LAST EDITED:     12/28/2020
////

import Cookies from 'js-cookie';

export class JWTAuthenticator {
    constructor(accessToken, refreshToken) {
        this.access = accessToken;
        this.refresh = refreshToken;
    }

    installHeader(headers) {
        headers['Authorization'] = `Bearer ${this.access}`;
    }
}

export class CSRFAuthenticator {
    constructor(csrfToken=undefined) {
        this.csrfToken = csrfToken;
    }

    installHeader(headers) {
        let token = this.csrfToken;
        if (typeof token === 'undefined') {
            token = Cookies.get('csrftoken');
        }
        headers['X-CSRFToken'] = token;
    }
}

///////////////////////////////////////////////////////////////////////////////
