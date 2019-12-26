pragma solidity 0.5.15;

import "EthereumClaimsRegistry.sol";

contract ItsMineContract {
    event registerAssetEvent(address manufacturer, bytes32 hashedAssetID);
    event claimAssetEvent(address claimant, address manufacturer, bytes32 hashedAssetID);
    event verifyClaimEvent(address verifier, address user, bytes32 hashedAssetID);
    event checkAssetRegistrationEvent(address manufacturer, address user, bytes32 hashedAssetID);
    
	mapping (address => bool) private certifiedManufacturers; 

	address owner;
	EthereumClaimsRegistry registry;

	//constructor sets address owner to contract creator
    constructor() public {
        owner = msg.sender;
        registry = EthereumClaimsRegistry(0xA5fe6fba1aB7cDd335BCfF22aEd6735e3Ff64edB);
    }

	// Only owner (contract creator) has rights
	modifier onlyOwner() {
        require(msg.sender == owner, "only owner can do this");
        _;
	}

	modifier onlyCertifiedManufacturer() {
        require(certifiedManufacturers[msg.sender] == true, "manufacturer is not certified");
        _;
	}

	function certifyManufacturer (address _manufacturer) public onlyOwner returns(bool) {
		require(certifiedManufacturers[_manufacturer] = false, "manufacturer is already certified");
		
        certifiedManufacturers[_manufacturer] = true;
	}

    // manufacturer registreert een asset
	function registerAsset (bytes32 _assetID) public onlyCertifiedManufacturer {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));

		registry.setClaim(msg.sender, hashedAssetID, bytes32(""));

		emit registerAssetEvent(msg.sender, hashedAssetID);
	}

	// user claimed een bepaalde asset
	function claimAsset (address _manufacturer, bytes32 _assetID) public {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 value = registry.getClaim(_manufacturer, _manufacturer, hashedAssetID);

		require(value != 0, "asset not registered"); // only a registered asset can be claimed
		require(value == bytes32(""), "asset already claimed"); // only an unclaimed asset can be claimed

		registry.setSelfClaim(hashedAssetID, bytes32("")); // claim I have the asset

		emit claimAssetEvent(msg.sender, _manufacturer, hashedAssetID);
	}

	// claim word geverified door manufacturer
	function verifyClaim (address _user, bytes32 _assetID) public onlyCertifiedManufacturer {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 value = registry.getClaim(msg.sender, msg.sender, hashedAssetID);

		require(value != 0, "asset not registered"); // only a registered asset can be verified
		require(value == bytes32(""), "asset already claimed"); // only an unclaimed asset can be verified

		registry.setSelfClaim(hashedAssetID, bytes32("C"));
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