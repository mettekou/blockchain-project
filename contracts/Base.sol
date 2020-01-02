pragma solidity 0.5.15;

import "EthereumClaimsRegistry.sol";

contract Base {
    event claimAssetEvent(address claimant, address manufacturer, bytes32 hashedAssetID);
    
	mapping (address => bool) private certifiedManufacturers; 
	
	address owner;
	EthereumClaimsRegistry registry;

	//constructor sets address owner to contract creator
    constructor() public {
        registry = EthereumClaimsRegistry(0x8d45312D3071190C90d7bfA96e0E0890D8C6e4F0);
    }

	// user claimed een bepaalde asset
	function claimAsset (address _manufacturer, bytes32 _assetID) public {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 value = registry.getClaim(_manufacturer, _manufacturer, hashedAssetID);

		require(value != 0, "asset not registered"); // only a registered asset can be claimed
		require(value == bytes32(""), "asset already claimed"); // only an unclaimed asset can be claimed

		registry.setClaim(msg.sender, hashedAssetID, bytes32("")); // claim I have the asset

		emit claimAssetEvent(msg.sender, _manufacturer, hashedAssetID);
	}

	// functie om te kijken of een asset succesvol geregistreerd en geverified is
	function checkAssetRegistration (address _manufacturer, address _user, bytes32 _assetID) public view returns (bool) {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 userValue = registry.getClaim(_manufacturer, _user, hashedAssetID);

		return userValue != 0;
	}

	// function () public { throw; }  //rejector function
	// function kill() public { if (msg.sender == owner) selfdestruct(owner); }
}