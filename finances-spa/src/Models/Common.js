///////////////////////////////////////////////////////////////////////////////
// NAME:            Common.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Definitions required by all Models
//
// CREATED:         12/11/2020
//
// LAST EDITED:     12/14/2020
////

let apiEndpointBase = '/finances/api/';
if (process.env.JEST_WORKER_ID !== 'undefined') {
    // We're running in Node.js--treat this like a test environment
    apiEndpointBase = 'http://localhost:8000' + apiEndpointBase;
}

export const ApiEndpointBaseUrl = apiEndpointBase;

///////////////////////////////////////////////////////////////////////////////
