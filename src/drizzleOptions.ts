const EthereumDIDRegistry = require('./abis/EthereumDIDRegistry.json');
const EthereumClaimsRegistry = require('./abis/EthereumClaimsRegistry.json');

const drizzleOptions = {
  contracts: [
    EthereumDIDRegistry,
    EthereumClaimsRegistry,
  ],
};

export default drizzleOptions;
