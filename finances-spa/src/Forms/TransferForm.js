///////////////////////////////////////////////////////////////////////////////
// NAME:            TransferForm.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Form to transfer assets from one fund to another.
//
// CREATED:         01/06/2021
//
// LAST EDITED:     01/12/2021
////

import React from 'react';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import Transaction from '../Models/Transaction.js';
import { GetYYYYMMDD } from '../FinancialMath.js';

export default class TransferForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: props.from,
            to: '',
            amount: 0,
            description: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleFromChange = this.handleChange.bind(this, 'from');
        this.handleToChange = this.handleChange.bind(this, 'to');
        this.handleAmountChange = this.handleChange.bind(this, 'amount');
        this.handleDescriptionChange = this.handleChange.bind(
            this, 'description');
    }

    handleChange(key, event) {
        this.setState(state => state[key] = event.target.value);
    }

    handleSubmit(event) {
        // Get the two fund instances
        const fromFund = this.props.funds[this.props.fundMap[this.state.from]];
        const toFund = this.props.funds[this.props.fundMap[this.state.to]];

        // Submit two transactions
        Transaction.collection.create({
            description: `${this.state.description} `
                + `(Tfer to ${toFund.description})`,
            // Subtract the amount from the first fund
            amount: -1 * this.state.amount,
            fund: fromFund.url
        }).then(transaction => {
            this.props.onDataUpdate(({transactions}) =>
                transactions.push(new Transaction(transaction)));
            return Transaction.collection.create({
                description: `${this.state.description} `
                    + `(Tfer from ${fromFund.description})`,
                // ...And add it to the second
                amount: this.state.amount,
                fund: toFund.url
            });
        }).then(transaction => {
            this.props.onDataUpdate(({transactions}) =>
                transactions.push(new Transaction(transaction)));
            this.props.onSubmit();
        }).catch(error => {
            throw error;
        });

        event.preventDefault();
    }

    render() {
        // TODO: Don't add From fund to To list
        return (
            <form onSubmit={this.handleSubmit}>
              <TextField
                select label="From" name="from" value={this.state.from}
                onChange={this.handleFromChange}>
                {this.props.funds.map(fund => (
                    <MenuItem key={fund.id} value={fund.id}>
                      {fund.description}
                    </MenuItem>
                ))}
              </TextField>
              <TextField
                select label="To" name="to" value={this.state.to}
                onChange={this.handleToChange}>
                {this.props.funds.map(fund => (
                    <MenuItem key={fund.id} value={fund.id}>
                      {fund.description}
                    </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Amount" type="number" value={this.state.amount}
                onChange={this.handleAmountChange} name="amount" />
              <TextField
                label="Description" value={this.state.description}
                onChange={this.handleDescriptionChange} name="description" />
              <div className="submit-group">
                <input type="submit" className="btn" value="Next" />
              </div>
            </form>
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
