///////////////////////////////////////////////////////////////////////////////
// NAME:            App.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implements the primary logic of the application.
//
// CREATED:         11/30/2020
//
// LAST EDITED:     01/05/2021
////

import './App.scss';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import Account from './Models/Account.js';
import Bank from './Models/Bank.js';
import Fund from './Models/Fund.js';
import Transaction from './Models/Transaction.js';

import AccountCreationForm from './Forms/AccountCreationForm.js';
import FundCreationForm from './Forms/FundCreationForm.js';

import FundList from './FundList.js';

// This is the URL we redirect to when we detect invalid login credentials.
const LOGIN_REDIRECT_URL = '/login/';

const ACCOUNT_SETUP = 1;
const FUND_SETUP = 2;

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            ready: false,
            userSetup: []
        };
    }

    getFormFields(setup, callback) {
        if (ACCOUNT_SETUP === setup) {
            return (
                <div className="">
                  <h1>Welcome!</h1>
                  <p>Before we begin, please tell me a little bit about your
                  existing bank accounts.</p>
                  <AccountCreationForm
                    onSubmit={callback}
                    banks={this.banks} />
                </div>
            );
        } else if (FUND_SETUP === setup) {
            return (
                <div className="">
                  <h1>Next, the Funds</h1>
                  <p>Now, tell me about something you're saving up for.</p>
                  <FundCreationForm
                    onSubmit={callback}
                    accounts={this.accounts} />
                </div>
            );
        }

        throw Error('getFormFields invoked without valid argument!');
    }

    componentDidMount() {
        // First, attempt to retrieve the funds.
        Fund.collection.all().then(data => {
            this.funds = data;
            return Transaction.collection.all();
        }).then(data => {
            this.transactions = data;
            return Account.collection.all();
        }).then(data => {
            this.accounts = data;
            // If there are fewer funds than there are accounts (or zero
            // accounts) trigger FUND_SETUP
            if (this.funds.length === 0 || this.funds.length <= data.length) {
                this.state.userSetup.unshift(FUND_SETUP);
            }

            // If there are no accounts, trigger ACCOUNT_SETUP.
            if (data.length === 0) {
                this.state.userSetup.unshift(ACCOUNT_SETUP);
                return Bank.collection.all().then(data => this.banks = data);
            }
            return {};
        }).catch(error => {
            if (error.number === 403 || error.number === 401) {
                window.location = LOGIN_REDIRECT_URL;
            } else {
                throw error;
            }
        }).finally(() => {
            this.setState({ready: true});
        });
    }

    renderLoading() {
        // TODO: Update renderLoading()
        return (
            <h1>Loading...</h1>
        );
    }

    renderUserSetup() {
        const formFields = this.getFormFields(
            this.state.userSetup[0],
            event => this.setState({userSetup: this.state.userSetup.slice(1)})
        );
        return (
            <div className="initializer-form">
              {formFields}
            </div>
        );
    }

    renderMain() {
        // TODO: Update renderNav()
        return (
            <Router basename="finances">
              <div>
                <nav>
                  <ul>
                    <li>
                      <Link to="/">Funds</Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <Switch>
                <Route path="/">
                  <FundList
                    funds={this.funds} accounts={this.accounts}
                    transactions={this.transactions} />
                </Route>
              </Switch>
            </Router>
        );
    }

    render() {
        let page;
        if (!this.state.ready) {
            page = this.renderLoading();
        } else if (this.state.userSetup.length > 0) {
            page = this.renderUserSetup();
        } else {
            page = this.renderMain();
        }
        return (
            <main>
              {page}
              <footer>
                <p>Copyright &copy; 2020 Ethan D. Twardy. All rights
                  reserved.</p>
              </footer>
            </main>
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
