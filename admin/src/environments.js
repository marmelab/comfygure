import React from 'react';
import { List, Datagrid, TextField } from 'admin-on-rest';

export const EnvironmentsList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="name" />
            <TextField source="id" />
        </Datagrid>
    </List>
);
