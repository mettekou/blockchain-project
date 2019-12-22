pragma solidity ^0.6.0;
contract ItsMineContract
{
	mapping (address => bool) private certifiedManufacturers; 
	mapping (bytes32 => address) private assetsRegistry;  // registry of registered assets hashedassetID ==> manufacturer address  
	mapping (bytes32 => address) private claimedAssetsRegistry; // registry of claimed assets hashedassetID ==> user address
	address owner;
	
	//constructor sets address owner to contract creator
    constructor() public {owner = msg.sender;}
	
	
		// Only owner (contract creator) has rights
		modifier onlyOwner(){
        require(msg.sender == owner);
        _;
		}
	
		modifier onlyCertifiedManufacturer(){
        require(certifiedManufacturers[msg.sender] == true, "manufacturer is not certified");
        _;
		}
	
		function certifyManufacturer (address _manufacturer) public onlyOwner {
        certifiedManufacturers[_manufacturer]=true;
		}		
	
		function registerAsset (bytes32 _assetID) public onlyCertifiedManufacturer {  //only Certified manufacturer can register an asset
			bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
			assetsRegistry[hashedAssetID]=msg.sender;
		}
		
		function claimAsset (address _manufacturer, bytes32 _assetID) public {
			require(certifiedManufacturers[_manufacturer] == true , "manufacturer is not certified");
			bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
			require(assetsRegistry[hashedAssetID] == _manufacturer, "asset not registered");			// only a registered asset can be claimed
			address user = claimedAssetsRegistry[hashedAssetID];
			require(user == address(0x0) , "asset already claimed"); 												// only an unclaimed asset can be claimed
			claimedAssetsRegistry[hashedAssetID] = msg.sender;
		}
		
		function verifyClaim (address _manufacturer, bytes32 _assetID, address _user) public view returns (bool _result) {
		require(certifiedManufacturers[_manufacturer] == true, "manufacturer is not certified");
		bytes32 hashedAssetID = keccak256(abi.encodePacked(_assetID));
		require(assetsRegistry[hashedAssetID] == _manufacturer , "asset not registered");
		address user = claimedAssetsRegistry[hashedAssetID];
		if (user == _user ) 
		{ _result= true;}														// returns true if asset is claimed by _user
		else
		{ _result = false;}														// returns false
		
		    
		}
		
		// function () public { throw; }  //rejector function
		// function kill() public { if (msg.sender == owner) selfdestruct(owner); }
}
		
