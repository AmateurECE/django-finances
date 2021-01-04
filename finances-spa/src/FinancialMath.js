///////////////////////////////////////////////////////////////////////////////
// NAME:            FinancialMath.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Classes for doing interesting financial mathematics.
//
// CREATED:         12/17/2020
//
// LAST EDITED:     01/04/2021
////

export class InterestRate {
    static fromNominal() {
        throw new Error('Unimplemented method: fromNominal');
    }

    static fromEffective() {
        throw new Error('Unimplemented method: fromEffective');
    }

    static fromPeriodic() {
        throw new Error('Unimplemented method: fromPeriodic');
    }

    getNominal() {
        throw new Error('Unimplemented method: getNominal');
    }

    getEffective() {
        throw new Error('Unimplemented method: getEffective');
    }

    getPeriodic() {
        throw new Error('Unimplemented method: getPeriodic');
    }

}

export function GetYYYYMMDD() {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    return [today.getFullYear(),
            (month > 9 ? '' : '0') + month,
            (date > 9 ? '' : '0') + date
           ].join('-');
}

///////////////////////////////////////////////////////////////////////////////
