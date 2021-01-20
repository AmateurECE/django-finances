///////////////////////////////////////////////////////////////////////////////
// NAME:            FundCreationForm.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Form for creation of Fund instances.
//
// CREATED:         12/30/2020
//
// LAST EDITED:     01/06/2021
////

import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import Fund from '../Models/Fund.js';

export default class FundCreationForm extends React.Component {
    constructor() {
        super();
        this.state = {
            account: '',
            description: '',
            target: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);

        this.accountChange = this.handleChange.bind(this, 'account');
        this.descriptionChange = this.handleChange.bind(this, 'description');
        this.targetChange = this.handleChange.bind(this, 'target');
    }

    handleChange(key, event) {
        this.setState(state => state[key] = event.target.value);
    }

    handleSubmit(event) {
        // Create the form
        // TODO: Create transaction for initial balance
        Fund.collection.create({
            description: this.state.description,
            account: this.state.account,
            target: parseFloat(this.state.target)
        }).then(fund => {
            this.props.onDataUpdate(data => data.funds.push(new Fund(fund)));
            this.props.onSubmit();
        });

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              <TextField
                label="Description of the Fund" name="description"
                value={this.state.description} placeholder="Fund Description"
                onChange={this.descriptionChange} />
              <TextField
                select label="Account" name="account"
                value={this.state.account} onChange={this.accountChange}>
                {this.props.accounts.map(account => (
                    <MenuItem key={account.url} value={account.url}>
                      {account.name}
                    </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Target Value of the Fund" value={this.state.target}
                name="target" onChange={this.targetChange} type="number" />
              <div className="submit-group">
                <input className="btn" type="submit" value="Next"/>
              </div>
            </form>
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
