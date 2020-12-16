///////////////////////////////////////////////////////////////////////////////
// NAME:            App.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implements the primary logic of the application.
//
// CREATED:         11/30/2020
//
// LAST EDITED:     12/16/2020
////

import './App.css';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import { Bank } from './Models/Bank.js';

// This is the URL we redirect to when we detect invalid login credentials.
const LOGIN_REDIRECT_URL = '/login/';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            ready: false,
            userSetupNecessary: false
        };
    }

    componentDidMount() {
        Bank.collection.all().then(data => {
            this.banks = data;
            if (data.length === 0) {
                this.setState({userSetupNecessary: true});
            }
            this.setState({ready: true});
        }).catch(error => {
            if (error.number === 403) {
                window.location = LOGIN_REDIRECT_URL;
            } else {
                throw error;
            }
        });
    }

    renderLoading() {
        return (
            <h1>Loading...</h1>
        );
    }

    renderNav() {
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

    renderUserSetup() {
        // TODO: renderUserSetup()
        return ({});
    }

    renderHomepage() {
        // TODO: renderHomepage()
        return ({});
    }

    render() {
        if (!this.state.ready) {
            return this.renderLoading();
        }

        const nav = this.renderNav();
        let page;
        if (this.state.userSetupNecessary) {
            page = this.renderUserSetup();
        } else {
            page = this.renderHomepage();
        }

        return (
            nav,
            page
        );
    }
}

///////////////////////////////////////////////////////////////////////////////
