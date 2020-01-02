pragma solidity ^0.4.26;

import "EthereumClaimsRegistry.sol";
import "EthereumDIDRegistry.sol";

contract Base {
    event claimAssetEvent(address claimant, address manufacturer, bytes32 hashedAssetID);
    
	mapping (address => bool) private certifiedManufacturers; 
	
	EthereumClaimsRegistry claimsRegistry;
	EthereumDIDRegistry identityRegistry;

    constructor() public {
        claimsRegistry = EthereumClaimsRegistry(0xc7939F65A2e4a860367119f035F7377C9871F096);
        identityRegistry = EthereumDIDRegistry(0x770d626c59a84C8190860bF8c1B1B97302953612);
    }

	// user claimed een bepaalde asset
	function claimAsset (address _manufacturer, bytes32 _assetID) public {
        require(identityRegistry.identityOwner(msg.sender) == msg.sender, "address not owned by sender");
    
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 value = claimsRegistry.getClaim(_manufacturer, _manufacturer, hashedAssetID);

		require(value != 0, "asset not registered"); // only a registered asset can be claimed
		require(value == bytes32("R"), "asset already claimed"); // only an unclaimed asset can be claimed

		claimsRegistry.setClaim(msg.sender, hashedAssetID, bytes32("")); // claim I have the asset

		emit claimAssetEvent(msg.sender, _manufacturer, hashedAssetID);
	}

	// functie om te kijken of een asset succesvol geregistreerd en geverified is
	function checkAssetRegistration (address _manufacturer, address _user, bytes32 _assetID) public view returns (bool) {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 userValue = claimsRegistry.getClaim(_manufacturer, _user, hashedAssetID);

		return userValue != 0;
	}

	// function () public { throw; }  //rejector function
	// function kill() public { if (msg.sender == owner) selfdestruct(owner); }
}