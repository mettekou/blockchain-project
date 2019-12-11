const EthereumDIDRegistry = artifacts.require("EthereumDIDRegistry");
const EthereumClaimsRegistry = artifacts.require("EthereumClaimsRegistry");

module.exports = function(deployer) {
  deployer.deploy(EthereumDIDRegistry);
  deployer.deploy(EthereumClaimsRegistry);
};
