///////////////////////////////////////////////////////////////////////////////
// NAME:            AccountCreationForm.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     The fields for an account creation form.
//
// CREATED:         12/17/2020
//
// LAST EDITED:     01/06/2021
////

import React from 'react';
import {AutocompleteTextInput} from './Common.js';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

// Models
import Bank from '../Models/Bank.js';
import Account from '../Models/Account.js';
import Fund from '../Models/Fund.js';
import Transaction from '../Models/Transaction.js';
import {GetYYYYMMDD, InterestRate} from '../FinancialMath.js';

export default class AccountCreationForm extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            bank: '',
            accountType: '',
            balance: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);

        this.nameChange = this.handleChange.bind(this, 'name');
        this.bankChange = this.handleChange.bind(this, 'bank');
        this.accountTypeChange = this.handleChange.bind(this, 'accountType');
        this.balanceChange = this.handleChange.bind(this, 'balance');
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

            Account.collection.create({
                name: this.state.name,
                bank: data.url,
                periodicInterestRate,
                accountType: this.state.accountType
            }).then(account => {
                this.account = new Account(account);
                return Fund.collection.create({
                    account: account.url,
                    description: `Unallocated (${this.state.name})`,
                    target: 0
                });
            }).then(fund => {
                this.accountUnallocatedFund = new Fund(fund);
                return Transaction.collection.create({
                    description: 'Initial balance for account creation',
                    amount: this.state.balance,
                    fund: fund.url,
                    date: GetYYYYMMDD()
                });
            }).then(transaction => {
                this.props.onDataUpdate(data => {
                    data.accounts.push(this.account);
                    data.funds.push(this.accountUnallocatedFund);
                    data.transactions.push(new Transaction(transaction));
                });
                this.props.onSubmit();
            });
        };
        if (createNewBank) {
            Bank.collection.create({name: this.state.bank}).then(data => {
                this.props.onDataUpdate(data =>
                    data.banks.push(new Bank(data)));
                makeAccount(data);
            });
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
              <TextField
                label="Current Balance" name="balance" type="number"
                value={this.state.balance} placeholder="Current Balance"
                onChange={this.balanceChange} />
              <div className="submit-group">
                <input className="btn" type="submit" value="Next"/>
              </div>
            </form>
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
