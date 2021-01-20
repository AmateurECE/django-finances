///////////////////////////////////////////////////////////////////////////////
// NAME:            FundList.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     View for list of the funds and balances of each.
//
// CREATED:         01/04/2021
//
// LAST EDITED:     01/12/2021
////

import React from 'react';
import TransferForm from './Forms/TransferForm.js';
import Modal from '@material-ui/core/Modal';

// import deleteIcon from '../images/trash.svg';
import transferIcon from './images/arrow-bar-up.svg';

function FundItem(props) {
    const {description, account, target, balance} = props.fund;
    return (
        <tr className="table-row">
          <td className="table-item fund-description">{description}</td>
          <td className="table-item fund-account">{account}</td>
          {(target && <td className="table-item fund-target">{target}</td>)
           || <td className="table-item fund-target-null">N/A</td>}
          {/* TODO: Calculate fund balance (just not here) */}
          <td className="table-item fund-balance">{balance}</td>
          <td>
            <div className="fund-action-form">
              {/* <button className="btn p-sm" onClick={props.deleteAction}>*/}
              {/*   <img src={deleteIcon} alt="delete" /> */}
              {/* </button> */}
              <button className="btn p-sm" onClick={props.onTransfer}>
                <img src={transferIcon} alt="transfer" />
              </button>
            </div>
          </td>
        </tr>
    );
}

export default class FundList extends React.Component {
    constructor() {
        super();
        this.state = {
            displayFunds: [],
            transferFromFund: 0
        };
        this.deleteFund = this.deleteFund.bind(this);
        this.openTransferModal = (fromId, event) => {
            this.setState(state => state.transferFromFund = fromId);
        };
    }

    deleteFund(id) {
        // TODO: Create transaction to move assets to another fund.
        const index = this.state.displayFundMapping[id];
        this.props.funds[index].delete().then(() => {
            // this.props.funds.splice(index, 1);
            // this.setState(state => {
            //     state.displayFunds.splice(index, 1);
            //     delete state.displayFundMapping[id];
            //     console.log(state.displayFunds);
            //     console.log(state.displayFundMapping);
            // });
            this.setState(state => state.displayFunds.splice(index, 1));
        }).catch(error => {
            throw error;
        });
    }

    componentDidMount() {
        // Fixup funds to give the account field a meaningful value
        let displayFunds = [];
        let displayFundMapping = {};
        // Create the mapping
        this.props.funds.forEach((fund, index) => {
            displayFundMapping[fund.id] = index;
        });

        this.props.funds.forEach(fund => {
            const fixedFund = {url: fund.url, id: fund.id, balance: 0,
                          description: fund.description, target: fund.target};
            for (let index in this.props.accounts) {
                if (this.props.accounts[index].url === fund.account) {
                    fixedFund.account = this.props.accounts[index].name;
                    displayFunds[displayFundMapping[fund.id]] = fixedFund;
                    break;
                }
            }
        });

        this.props.transactions.forEach(transaction => {
            const id = parseInt(transaction.fund.match(/.*\/([0-9]+)\/$/)[1]);
            displayFunds[displayFundMapping[id]].balance += transaction.amount;
        });
        this.setState({displayFunds, displayFundMapping});
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
                      <FundItem
                        key={fund.id} fund={fund}
                        onTransfer={this.openTransferModal.bind(this, fund.id)}
                        onDelete={this.deleteFund} />
                  ))}
                </tbody>
              </table>

              <div>
                <Modal
                  open={this.state.transferFromFund !== 0}
                  aria-labelledby="fund-transfer-dialog"
                  aria-describedby="transfer funds"
                  onClose={() => this.setState(state =>
                      state.transferFromFund = 0)}>
                  <div className="modal-form">
                    <TransferForm
                      onDataUpdate={this.props.onDataUpdate}
                      onSubmit={() => this.setState(state =>
                          state.transferFromFund = 0)}
                      funds={this.state.displayFunds}
                      fundMap={this.state.displayFundMapping}
                      from={this.state.transferFromFund} />
                  </div>
                </Modal>
              </div>
            </div>
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
