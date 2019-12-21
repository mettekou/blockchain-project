import { drizzleConnect } from '@drizzle/react-plugin';

import App from '../components/App';

const mapStateToProps = (state) => ({
  drizzleStatus: state.drizzleStatus,
  EthereumDIDRegistry: state.contracts.EthereumDIDRegistry,
  EthereumClaimsRegistry: state.contracts.EthereumClaimsRegistry,
  web3: state.web3,
});

const AppContainer = drizzleConnect(App, mapStateToProps);

export default AppContainer;
