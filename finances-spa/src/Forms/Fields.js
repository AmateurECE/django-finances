///////////////////////////////////////////////////////////////////////////////
// NAME:            Fields.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Some basic helpful field wrappers for forms.
//
// CREATED:         12/17/2020
//
// LAST EDITED:     12/17/2020
////

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export function AutocompleteTextInput(props) {
    return (
        <Autocomplete
          id={props.id}
          options={props.options}
          getOptionLabel={props.getOptionLabel}
          renderInput={params => <TextField {...params} label={props.label}/>}
        />
    );
}

///////////////////////////////////////////////////////////////////////////////
