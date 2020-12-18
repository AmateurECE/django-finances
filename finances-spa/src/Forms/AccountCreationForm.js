///////////////////////////////////////////////////////////////////////////////
// NAME:            AccountCreationForm.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     The fields for an account creation form.
//
// CREATED:         12/17/2020
//
// LAST EDITED:     12/17/2020
////

import React from 'react';
import {AutocompleteTextInput} from './Fields.js';

export default class AccountCreationForm extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        // Prepare Bank?
        // Prepare Account, (including interest rate)
        // Create initial transaction for current balance
        console.log('Submitting form!');
        this.props.onSubmit();
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              <label>Name
                <input name="name" type="text" value={this.state.name}
                       placeholder="Account Name" />
              </label>
              <AutocompleteTextInput
                id="account-creation-bank"
                options={this.props.banks}
                getOptionLabel={option => option.name}
                label="Bank"
              />
              <label>Interest Rate
                <input name="periodicInterestRate" type="number" step="0.01"
                       value={this.state.interestRate}/>
              </label>
              <label>Interest Rate Type
                <select name="interestRateType"
                        value={this.state.interestRateType}>
                  <option value="APR">APR</option>
                  <option value="APY">APY</option>
                </select>
              </label>
              <label>Account Type
                <select name="accountType" value={this.state.accountType}>
                  <option value="CHECKING">Checking</option>
                  <option value="SAVINGS">Savings</option>
                </select>
              </label>
              <label>Current Balance
                <input type="number" name="currentBalance" step="0.01"
                       value={this.currentBalance} />
              </label>
              <input type="submit" value="Next"/>
            </form>
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
