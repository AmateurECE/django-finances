///////////////////////////////////////////////////////////////////////////////
// NAME:            App.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implements the primary logic of the application.
//
// CREATED:         11/30/2020
//
// LAST EDITED:     12/05/2020
////

import './App.css';
import React from 'react';

class JsonComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        fetch(this.props.url).then(
            response => response.json()
        ).then(data => this.setState({data}));
    }

    render() {
        return (
            <p>{JSON.stringify(this.state.data)}</p>
        );
    }
}

function App() {
    return (
        <div>
          <p><JsonComponent url="/finances/api/users/"/></p>
          <p><JsonComponent url="/finances/api/banks/"/></p>
          <p><JsonComponent url="/finances/api/accounts/"/></p>
          <p><JsonComponent url="/finances/api/funds/"/></p>
        </div>
    );
}

export default App;

///////////////////////////////////////////////////////////////////////////////
