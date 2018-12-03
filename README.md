# Loopback Client for react-admin
For using [Loopback 3](https://loopback.io/) with [react-admin](https://github.com/marmelab/react-admin).

## Installation

```bash
npm install --save react-admin-loopback
```

## Prerequisite

* Your loopback server must response `Content-Range` header when querying list. Please use [loopback-content-range](https://github.com/darthwesker/loopback-content-range) on your server end.

## Usage

```js
// in src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import loopbackClient, { authProvider } from 'react-admin-loopback';
import { List, Datagrid, TextField, NumberField } from 'react-admin';

import { ShowButton, EditButton, Edit, SimpleForm, DisabledInput, TextInput, NumberInput } from 'react-admin';
import { Create} from 'react-admin';
import { Show, SimpleShowLayout } from 'react-admin';

const BookList = (props) => (
  <List {...props}>
    <Datagrid>
      <ShowButton />
      <EditButton />
      <TextField source="author" />
      <NumberField source="count" />
    </Datagrid>
  </List>
);
export const BookShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="author" />
      <NumberField source="count" />
    </SimpleShowLayout>
  </Show>
);
export const BookEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="author" />
      <NumberInput source="count" />
    </SimpleForm>
  </Edit>
);
export const BookCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="author" />
      <NumberInput source="count" />
    </SimpleForm>
  </Create>
);
const App = () => (
  <Admin dataProvider={loopbackClient('http://localhost:3000')} authProvider={authProvider('http://localhost:3000/users/login')}>
    <Resource name="books" show={BookShow} create={BookCreate} edit={BookEdit} list={BookList} />
  </Admin>
);

export default App;
```

The dataProvider supports include:

```js
// dataProvider.js
import loopbackProvider from 'react-admin-loopback';

const dataProvider = loopbackProvider('http://localhost:3000');
export default (type, resource, params) => 
  new Promise(resolve => 
    setTimeout(() => resolve(dataProvider(type, resource, params)), 500)  
  );
```

```js

import dataProvider from './dataProvider';

...

dataProvider(GET_LIST, 'books', {
  filter: { hide: false },
  sort: { field: 'id', order: 'DESC' },
  pagination: { page: 1, perPage: 0 },
  include: 'users'
}).then(response => {
  ...
});

...

```

## License

This library is licensed under the [MIT Licence](LICENSE).