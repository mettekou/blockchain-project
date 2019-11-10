import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Web3 from 'web3';
import Web3Provider from 'web3-react';

import connectors from './connectors';
import App from './components/App';

ReactDOM.render(
  <Web3Provider connectors={connectors} libraryName="web3.js" web3Api={Web3}>
    <App />
  </Web3Provider>,
  document.getElementById('app'),
);
