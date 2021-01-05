///////////////////////////////////////////////////////////////////////////////
// NAME:            FundList.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     View for list of the funds and balances of each.
//
// CREATED:         01/04/2021
//
// LAST EDITED:     01/05/2021
////

import React from 'react';

function Fund(props) {
    const {description, account, target} = props.fund;
    return (
        <tr className="table-row">
          <td className="table-item fund-description">{description}</td>
          <td className="table-item fund-account">{account}</td>
          {(target && <td className="table-item fund-target">{target}</td>)
           || <td className="table-item fund-target-null">N/A</td>}
          {/* TODO: Calculate fund balance (just not here) */}
          <td className="table-item fund-balance">0</td>
        </tr>
    );
}

export default class FundList extends React.Component {
    constructor() {
        super();
        this.state = {displayFunds: []};
    }

    componentDidMount() {
        // Fixup funds to give the account field a meaningful value
        let displayFunds = [];
        this.props.funds.forEach(fund => {
            for (let index in this.props.accounts) {
                if (this.props.accounts[index].url === fund.account) {
                    displayFunds.push({
                        url: fund.url,
                        id: fund.id,
                        description: fund.description,
                        target: fund.target,
                        account: this.props.accounts[index].name
                    });
                }
            }
        });
        this.setState({displayFunds});
    }

    render() {
        return (
            <div className="main">
              <h1>Funds</h1>
              <table className="table">
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Account</td>
                    <td>Target</td>
                    <td>Balance</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.displayFunds.map(fund => (
                      <Fund key={fund.id} fund={fund}/>
                  ))}
                </tbody>
              </table>
            </div>
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
