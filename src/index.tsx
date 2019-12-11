import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Web3ReactProvider, UnsupportedChainIdError } from '@web3-react/core';
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector';
import { Web3Provider } from "@ethersproject/providers";

import App from './components/App';
import { injected } from './connectors';

const getLibrary = (provider: any) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
};

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>,
  document.getElementById('app'),
);
