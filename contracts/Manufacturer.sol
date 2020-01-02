pragma solidity ^0.4.26;

import "EthereumClaimsRegistry.sol";
import "EthereumDIDRegistry.sol";

contract Manufacturer {
    event registerAssetEvent(address manufacturer, bytes32 hashedAssetID);
    event verifyClaimEvent(address verifier, address user, bytes32 hashedAssetID);
    
	EthereumClaimsRegistry claimsRegistry;
	EthereumDIDRegistry identityRegistry;

    constructor() public {
        claimsRegistry = EthereumClaimsRegistry(0xc7939F65A2e4a860367119f035F7377C9871F096);
        identityRegistry = EthereumDIDRegistry(0x770d626c59a84C8190860bF8c1B1B97302953612);
    }

    // manufacturer registreert een asset
	function registerAsset (bytes32 _assetID) public {
        require(identityRegistry.identityOwner(address(this)) == address(this), "address not owned by sender");
        
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));

        claimsRegistry.setSelfClaim(hashedAssetID, bytes32("R")); 

		emit registerAssetEvent(address(this), hashedAssetID);
	}

	// claim word geverified door manufacturer
	function verifyClaim (address _user, bytes32 _assetID) public {
        require(identityRegistry.identityOwner(address(this)) == address(this), "address not owned by sender");
        
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 value = claimsRegistry.getClaim(address(this), address(this), hashedAssetID);

		require(value != 0, "asset not registered"); // only a registered asset can be verified
		require(value == bytes32("R"), "asset already claimed"); // only an unclaimed asset can be verified

		claimsRegistry.setSelfClaim(hashedAssetID, bytes32("C")); // mark as claimed
		claimsRegistry.setClaim(_user, hashedAssetID, bytes32("C")); // manufacturer confirms user has the asset

		emit verifyClaimEvent(address(this), _user, hashedAssetID);
	}

	// function () public { throw; }  //rejector function
	// function kill() public { if (msg.sender == owner) selfdestruct(owner); }
}