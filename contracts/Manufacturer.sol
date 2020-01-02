pragma solidity 0.5.15;

import "EthereumClaimsRegistry.sol";

contract Manufacturer {
    event registerAssetEvent(address manufacturer, bytes32 hashedAssetID);
    event verifyClaimEvent(address verifier, address user, bytes32 hashedAssetID);
    
	EthereumClaimsRegistry registry;

	//constructor sets address owner to contract creator
    constructor() public {
        registry = EthereumClaimsRegistry(0x8d45312D3071190C90d7bfA96e0E0890D8C6e4F0);
    }

    // manufacturer registreert een asset
	function registerAsset (bytes32 _assetID) public {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));

        registry.setSelfClaim(hashedAssetID, bytes32("")); 

		emit registerAssetEvent(msg.sender, hashedAssetID);
	}

	// claim word geverified door manufacturer
	function verifyClaim (address _user, bytes32 _assetID) public {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 value = registry.getClaim(msg.sender, msg.sender, hashedAssetID);

		require(value != 0, "asset not registered"); // only a registered asset can be verified
		require(value == bytes32(""), "asset already claimed"); // only an unclaimed asset can be verified

		registry.setSelfClaim(hashedAssetID, bytes32("C")); // mark as claimed
		registry.setClaim(_user, hashedAssetID, bytes32("")); // manufacturer confirms user has the asset

		emit verifyClaimEvent(msg.sender, _user, hashedAssetID);
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