import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropdownExampleSearchSelection = (props) => (
    <Dropdown
        fluid
        clearable
        search
        selection
        options={props.data}
        onChange={props.handleDropDownSelect}
        id={props.id}
    />
)

export default DropdownExampleSearchSelection