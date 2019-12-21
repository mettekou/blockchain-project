import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DrizzleProvider } from '@drizzle/react-plugin';

import drizzleOptions from './drizzleOptions';
import AppContainer from './containers/AppContainer';

ReactDOM.render(
  <DrizzleProvider options={drizzleOptions}>
    <AppContainer />
  </DrizzleProvider>,
  document.getElementById('app'),
);
