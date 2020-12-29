///////////////////////////////////////////////////////////////////////////////
// NAME:            App.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implements the primary logic of the application.
//
// CREATED:         11/30/2020
//
// LAST EDITED:     12/29/2020
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
import AccountCreationForm from './Forms/AccountCreationForm.js';

// This is the URL we redirect to when we detect invalid login credentials.
const LOGIN_REDIRECT_URL = '/login/';

const ACCOUNT_SETUP = 1;

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
                    banks={this.banks}
                  />
                </div>
            );
        }

        throw Error('getFormFields invoked without valid argument!');
    }

    componentDidMount() {
        Account.collection.all().then(data => {
            this.accounts = data;
            if (data.length === 0) {
                return Bank.collection.all().then(data => {
                    this.banks = data;
                    this.state.userSetup.push(ACCOUNT_SETUP);
                });
            }
            return new Promise((resolve, reject) => resolve());
        }).catch(error => {
            if (error.number === 403) {
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
            event => this.setState({userSetup: this.state.userSetup.shift()})
        );
        return (
            <div className="initializer-form">
              {formFields}
            </div>
        );
    }

    renderNav() {
        // TODO: Update renderNav()
        return (
            <Router>
              <div>
                <nav>
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <Switch>
                <Route path="/">
                </Route>
              </Switch>
            </Router>
        );
    }

    renderHomepage() {
        // TODO: renderHomepage()
        return (null);
    }

    render() {
        let page;
        if (!this.state.ready) {
            page = this.renderLoading();
        } else if (this.state.userSetup.length > 0) {
            page = this.renderUserSetup();
        } else {
            page = this.renderHomepage();
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
