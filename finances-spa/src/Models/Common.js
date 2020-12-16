///////////////////////////////////////////////////////////////////////////////
// NAME:            Common.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Definitions required by all Models
//
// CREATED:         12/11/2020
//
// LAST EDITED:     12/16/2020
////

let apiEndpointBase = '/finances/api/';
if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
    // We're running in Node.js--treat this like a test environment
    apiEndpointBase = 'http://localhost:8000' + apiEndpointBase;
    console.log('JEST_WORKER_ID: ' + process.env.JEST_WORKER_ID);
}

export const ApiEndpointBaseUrl = apiEndpointBase;

///////////////////////////////////////////////////////////////////////////////
