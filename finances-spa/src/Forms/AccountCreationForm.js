///////////////////////////////////////////////////////////////////////////////
// NAME:            AccountCreationForm.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     The fields for an account creation form.
//
// CREATED:         12/17/2020
//
// LAST EDITED:     12/30/2020
////

import React from 'react';
import {AutocompleteTextInput} from './Common.js';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

// Models
import Bank from '../Models/Bank.js';
import Account from '../Models/Account.js';
import {InterestRate} from '../FinancialMath.js';

export default class AccountCreationForm extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            bank: '',
            accountType: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);

        this.nameChange = this.handleChange.bind(this, 'name');
        this.bankChange = this.handleChange.bind(this, 'bank');
        this.accountTypeChange = this.handleChange.bind(this, 'accountType');
    }

    handleChange(key, event) {
        this.setState(state => state[key] = event.target.value);
    }

    handleSubmit(event) {
        // Prepare Bank
        let createNewBank = true;
        let url;
        for (let id in this.props.banks) {
            const bank = this.props.banks[id];
            if (bank.name === this.state.bank) {
                createNewBank = false;
                url = bank.url;
                break;
            }
        }

        const makeAccount = data => {
            // Prepare Account, (including interest rate)            
            let periodicInterestRate = 0.0;
            // TODO: periodicInterestRate
            // if ('APY' === this.state.interestRateType) {
            //     periodicInterestRate = InterestRate.fromEffective(
            //         this.state.interestRate);
            // } else {
            //     periodicInterestRate = InterestRate.fromNominal(
            //         this.state.interestRate);
            // }

            // TODO: Create initial transaction for current balance
            // TODO: Create (unallocated) fund
            Account.collection.create({
                name: this.state.name,
                bank: data.url,
                periodicInterestRate,
                accountType: this.state.accountType
            }).then(this.props.onSubmit());
        };
        if (createNewBank) {
            Bank.collection.create({name: this.state.bank}).then(makeAccount);
        } else {
            makeAccount({url});
        }

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              <TextField
                label="Name of the Account" name="name" value={this.state.name}
                placeholder="Account Name"
                onChange={this.nameChange} />
              <AutocompleteTextInput
                /* TODO: Add onChange Validation */
                id="account-creation-bank" options={this.props.banks}
                getOptionLabel={option => option.name} label="Bank"
                onInputChange={(event, newInputValue) =>
                this.bankChange({target: {value: newInputValue}})}/>
              {/* <div className="related-input-group-control"> */}
              {/*   <TextField */}
              {/*     type="number" label="Interest Rate (%)" */}
              {/*     name="periodicInterestRate" step="0.01" */}
              {/*     value={this.state.interestRate} /> */}
              {/*   <TextField */}
              {/*     label="Interest Rate Type" select */}
              {/*     value={this.state.interestRateType}> */}
              {/*     <option key="APR" value="APR">APR</option> */}
              {/*     <option key="APY" value="APY">APY</option> */}
              {/*   </TextField> */}
              {/* </div> */}
              <TextField
                onChange={this.accountTypeChange}
                label="Account Type" select defaultValue=''>
                  <MenuItem value="CHECKING">Checking</MenuItem>
                  <MenuItem value="SAVINGS">Savings</MenuItem>
              </TextField>
              {/* <label>Current Balance */}
              {/*   <input type="number" name="currentBalance" step="0.01" */}
              {/*          value={this.currentBalance} /> */}
              {/* </label> */}
              <div className="submit-group">
                <input className="btn" type="submit" value="Next"/>
              </div>
            </form>
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
