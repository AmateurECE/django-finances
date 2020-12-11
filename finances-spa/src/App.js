///////////////////////////////////////////////////////////////////////////////
// NAME:            App.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Implements the primary logic of the application.
//
// CREATED:         11/30/2020
//
// LAST EDITED:     12/09/2020
////

import './App.css';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import {
    Transaction,
    GetTransaction
} from './Transaction.js';

class JsonComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        const transaction = new GetTransaction(this.props.url);
        transaction.complete().then(data => this.setState({data}));
    }

    render() {
        return (
            <p>{JSON.stringify(this.state.data)}</p>
        );
    }
}

export default function App() {
    return (
        <JsonComponent url="/finances/api/banks/" />
    );
}

// export default function App() {
//     return (
//         <Router>
//           <div>
//             <nav>
//               <ul>
//                 <li>
//                   <Link to="/">Home</Link>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </Router>
//     );
// }

///////////////////////////////////////////////////////////////////////////////
