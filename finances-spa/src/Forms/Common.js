///////////////////////////////////////////////////////////////////////////////
// NAME:            Common.js
//
// AUTHOR:          Ethan D. Twardy <edtwardy@mtu.edu>
//
// DESCRIPTION:     Some basic helpful field wrappers for forms.
//
// CREATED:         12/17/2020
//
// LAST EDITED:     01/04/2021
////

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export function AutocompleteTextInput(props) {
    return (
        <Autocomplete
          id={props.id || 'autocomplete'}
          freeSolo
          options={props.options}
          inputValue={props.value}
          getOptionLabel={props.getOptionLabel}
          renderInput={params =>
              <TextField {...params} label={props.label}/>}
          {...props}
        />
    );
}

export const INPUT_CLASSES = [
    'form-control'
];

export const LABEL_CLASSES = [];

export function LabelledFormGroup(props) {
    return (
        <div className="form-group">
          <label className={[...LABEL_CLASSES]}>{props.label}</label>
          {props.children}
        </div>
    );
}

export function LabelledTextInput(props) {
    return (
        <LabelledFormGroup label={props.label}>
          <input type="text" className={[...INPUT_CLASSES]} {...props}/>
        </LabelledFormGroup>
    );
}

export function LabelledNumberInput(props) {
    return (
        <LabelledFormGroup label={props.label}>
          <input type="number" className={[...INPUT_CLASSES]} {...props}/>
        </LabelledFormGroup>
    );
}

///////////////////////////////////////////////////////////////////////////////
