pragma solidity 0.5.15;

import "EthereumClaimsRegistry.sol";

contract ItsMineContract {
	mapping (address => bool) private certifiedManufacturers; 

	address owner;
	EthereumClaimsRegistry registry;

	//constructor sets address owner to contract creator
    constructor() public {
        owner = msg.sender;
        registry = EthereumClaimsRegistry(0x602152C9b222801e94D08f3878D8a324546E2016);
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
        certifiedManufacturers[_manufacturer] = true;
	}

    // manufacturer registreert een asset
	function registerAsset (bytes32 _assetID) public onlyCertifiedManufacturer {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));

		registry.setSelfClaim(hashedAssetID, bytes32(""));

		// event
	}

	// user claimed een bepaalde asset
	function claimAsset (address _manufacturer, bytes32 _assetID) public {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 value = registry.getClaim(_manufacturer, _manufacturer, hashedAssetID);

		require(value != 0, "asset not registered"); // only a registered asset can be claimed
		require(value == bytes32(""), "asset already claimed"); // only an unclaimed asset can be claimed

		registry.setSelfClaim(hashedAssetID, bytes32("")); // claim I have the asset

		// event zodat manufacturer kan reageren
	}

	// claim word geverified door manufacturer
	function verifyClaim (address _user, bytes32 _assetID) public onlyCertifiedManufacturer {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 value = registry.getClaim(msg.sender, msg.sender, hashedAssetID);

		require(value != 0, "asset not registered"); // only a registered asset can be verified
		require(value == bytes32(""), "asset already claimed"); // only an unclaimed asset can be verified

		registry.setSelfClaim(hashedAssetID, bytes32("C"));
		registry.setClaim(_user, hashedAssetID, bytes32("")); // manufacturer confirms user has the asset

		// event om te confirmen dat verification gelukt is
	}

	// functie om te kijken of een asset succesvol geregistreerd en geverified is
	function checkAssetRegistration (address _manufacturer, address _user, bytes32 _assetID) public view returns (bool) {
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		bytes32 userValue = registry.getClaim(_manufacturer, _user, hashedAssetID);
		require(userValue != 0, "asset not verified");

		return true; // todo

		//  event met result
	}

	// function () public { throw; }  //rejector function
	// function kill() public { if (msg.sender == owner) selfdestruct(owner); }
}