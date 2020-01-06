import { InferProps } from 'prop-types';
import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Typography from '@material-ui/core/Typography';

import useStyles from '../useStyles';
import IdentityCreation from './IdentityCreation';
import { useEagerConnect, useInactiveListener } from '../hooks';
import QrCodeInput from './QrCodeInput';
import { Container, AppBar } from '@material-ui/core';

const App = () => {
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;
  const classes = useStyles();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const [ethBalance, setEthBalance] = React.useState();
  React.useEffect(() => {
    if (library && account) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setEthBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setEthBalance(null);
          }
        });

      return () => {
        stale = true;
        setEthBalance(undefined);
      };
    }
  }, [library, account, chainId]);

  useEffect(() => console.log(account));

  return (
    <>
      <AppBar position="static">
        <Typography variant="h6">
          Smart Battery App
        </Typography>
      </AppBar>
        <Container>
          <QrCodeInput />
        </Container>
    </>
  );
};

App.propTypes = {
};

export default App;
