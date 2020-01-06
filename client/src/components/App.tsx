import { InferProps } from 'prop-types';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';

import useStyles from '../useStyles';
import Login from './Login';
import Prosumer from './Prosumer';
import Manufacturer from './Manufacturer';

const App = () => {
  const classes = useStyles();
  const [identity, setIdentity] = useState({ name: null, role: '', postalAddress: null, address: null, privateKey: null });

  switch (identity.role) {
    case 'Manufacturer':
      return <Manufacturer identity={identity} />;
    case 'Prosumer':
      return <Prosumer identity={identity} />;
    default:
      return <Login setIdentity={setIdentity} />;
  };
};

export default App;
