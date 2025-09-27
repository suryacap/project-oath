// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@ensdomains/ens-contracts/contracts/wrapper/INameWrapper.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/PublicResolver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

/**
 * @title MedicineENSRegistrar
 * @dev ENS subname registrar for medicine contracts
 * Allows each medicine to have its own ENS subname under a parent domain
 */
contract MedicineENSRegistrar is Ownable, ERC1155Holder {
    INameWrapper public immutable nameWrapper;
    PublicResolver public immutable publicResolver;
    
    // Parent domain configuration
    bytes32 public parentNode;
    string public parentDomain;
    
    // Medicine to ENS subname mapping (format: medicinename.manufacturername)
    mapping(address => string) public medicineToSubname;
    mapping(string => address) public subnameToMedicine;
    
    // Manufacturer to subdomain mapping
    mapping(address => string) public manufacturerToSubdomain;
    mapping(string => address) public subdomainToManufacturer;
    
    // Registry to subdomain mapping (for medicine registries)
    mapping(address => string) public registryToSubdomain;
    mapping(string => address) public subdomainToRegistry;
    
    // Registration fee (in wei)
    uint256 public registrationFee;
    
    constructor(
        address _nameWrapper,
        address _publicResolver,
        uint256 _registrationFee
    ) Ownable(msg.sender) {
        nameWrapper = INameWrapper(_nameWrapper);
        publicResolver = PublicResolver(_publicResolver);
        registrationFee = _registrationFee;
    }
    
    /**
     * @dev Set the parent domain for subname registration
     * @param _parentNode The namehash of the parent domain
     * @param _parentDomain The parent domain name (e.g., "oath.eth")
     */
    function setParentDomain(bytes32 _parentNode, string calldata _parentDomain) external onlyOwner {
        parentNode = _parentNode;
        parentDomain = _parentDomain;
    }
    
    /**
     * @dev Set the registration fee for subnames
     * @param _fee The new registration fee in wei
     */
    function setRegistrationFee(uint256 _fee) external onlyOwner {
        registrationFee = _fee;
    }
    
    /**
     * @dev Register a manufacturer subdomain
     * @param _manufacturer The address of the manufacturer
     * @param _subdomain The desired manufacturer subdomain
     * @param _resolver Optional custom resolver address (0 for default)
     */
    function registerManufacturerSubdomain(
        address _manufacturer,
        string calldata _subdomain,
        address _resolver
    ) external payable {
        require(parentNode != bytes32(0), "Parent domain not set");
        require(msg.value >= registrationFee, "Insufficient payment");
        require(bytes(manufacturerToSubdomain[_manufacturer]).length == 0, "Manufacturer already has subdomain");
        require(subdomainToManufacturer[_subdomain] == address(0), "Subdomain already taken");
        require(_manufacturer != address(0), "Invalid manufacturer address");
        
        // Use default resolver if none provided
        address resolver = _resolver == address(0) ? address(publicResolver) : _resolver;
        
        // Set the manufacturer as the owner of the subdomain
        nameWrapper.setSubnodeRecord(
            parentNode,
            _subdomain,
            _manufacturer, // owner
            resolver,      // resolver
            0,            // ttl
            65536,        // fuses: CAN_EXTEND_EXPIRY
            uint64(block.timestamp + 365 days) // expiry: 1 year
        );
        
        // Store the mapping
        manufacturerToSubdomain[_manufacturer] = _subdomain;
        subdomainToManufacturer[_subdomain] = _manufacturer;
        
        // Set some default records for the manufacturer
        if (resolver == address(publicResolver)) {
            // Set ETH address record
            publicResolver.setAddr(
                keccak256(abi.encodePacked(parentNode, keccak256(bytes(_subdomain)))),
                _manufacturer
            );
            
            // Set text record with manufacturer info
            publicResolver.setText(
                keccak256(abi.encodePacked(parentNode, keccak256(bytes(_subdomain)))),
                "description",
                string(abi.encodePacked("Manufacturer: ", _subdomain))
            );
        }
    }
    
    /**
     * @dev Register a registry subdomain (for medicine registries)
     * @param _registry The address of the registry contract
     * @param _subdomain The desired registry subdomain
     * @param _resolver Optional custom resolver address (0 for default)
     */
    function registerRegistrySubdomain(
        address _registry,
        string calldata _subdomain,
        address _resolver
    ) external payable {
        require(parentNode != bytes32(0), "Parent domain not set");
        require(msg.value >= registrationFee, "Insufficient payment");
        require(bytes(registryToSubdomain[_registry]).length == 0, "Registry already has subdomain");
        require(subdomainToRegistry[_subdomain] == address(0), "Subdomain already taken");
        require(_registry != address(0), "Invalid registry address");
        
        // Use default resolver if none provided
        address resolver = _resolver == address(0) ? address(publicResolver) : _resolver;
        
        // Set the registry contract as the owner of the subdomain
        nameWrapper.setSubnodeRecord(
            parentNode,
            _subdomain,
            _registry, // owner
            resolver,  // resolver
            0,        // ttl
            65536,    // fuses: CAN_EXTEND_EXPIRY
            uint64(block.timestamp + 365 days) // expiry: 1 year
        );
        
        // Store the mapping
        registryToSubdomain[_registry] = _subdomain;
        subdomainToRegistry[_subdomain] = _registry;
        
        // Set some default records for the registry
        if (resolver == address(publicResolver)) {
            // Set ETH address record
            publicResolver.setAddr(
                keccak256(abi.encodePacked(parentNode, keccak256(bytes(_subdomain)))),
                _registry
            );
            
            // Set text record with registry info
            publicResolver.setText(
                keccak256(abi.encodePacked(parentNode, keccak256(bytes(_subdomain)))),
                "description",
                string(abi.encodePacked("Medicine Registry: ", _subdomain))
            );
        }
    }
    
    /**
     * @dev Register a subname for a medicine contract under a manufacturer subdomain
     * @param _medicine The address of the medicine contract
     * @param _medicineName The name of the medicine
     * @param _manufacturerSubdomain The manufacturer's subdomain
     * @param _resolver Optional custom resolver address (0 for default)
     */
    function registerMedicineSubname(
        address _medicine,
        string calldata _medicineName,
        string calldata _manufacturerSubdomain,
        address _resolver
    ) external payable {
        require(parentNode != bytes32(0), "Parent domain not set");
        require(msg.value >= registrationFee, "Insufficient payment");
        require(bytes(medicineToSubname[_medicine]).length == 0, "Medicine already has subname");
        require(_medicine != address(0), "Invalid medicine address");
        require(bytes(_medicineName).length > 0, "Medicine name cannot be empty");
        require(bytes(_manufacturerSubdomain).length > 0, "Manufacturer subdomain cannot be empty");
        
        // Check if manufacturer subdomain exists
        require(subdomainToManufacturer[_manufacturerSubdomain] != address(0), "Manufacturer subdomain does not exist");
        
        // Create the full subname: medicinename.manufacturername
        string memory fullSubname = string(abi.encodePacked(_medicineName, ".", _manufacturerSubdomain));
        require(subnameToMedicine[fullSubname] == address(0), "Medicine subname already taken");
        
        // Use default resolver if none provided
        address resolver = _resolver == address(0) ? address(publicResolver) : _resolver;
        
        // Get the manufacturer subdomain node
        bytes32 manufacturerNode = keccak256(abi.encodePacked(parentNode, keccak256(bytes(_manufacturerSubdomain))));
        
        // Set the medicine contract as the owner of the subname under manufacturer subdomain
        nameWrapper.setSubnodeRecord(
            manufacturerNode,
            _medicineName,
            _medicine, // owner
            resolver,  // resolver
            0,        // ttl
            65536,    // fuses: CAN_EXTEND_EXPIRY
            uint64(block.timestamp + 365 days) // expiry: 1 year
        );
        
        // Store the mapping
        medicineToSubname[_medicine] = fullSubname;
        subnameToMedicine[fullSubname] = _medicine;
        
        // Set some default records for the medicine
        if (resolver == address(publicResolver)) {
            // Set ETH address record
            publicResolver.setAddr(
                keccak256(abi.encodePacked(manufacturerNode, keccak256(bytes(_medicineName)))),
                _medicine
            );
            
            // Set text record with medicine info
            publicResolver.setText(
                keccak256(abi.encodePacked(manufacturerNode, keccak256(bytes(_medicineName)))),
                "description",
                string(abi.encodePacked("Medicine: ", _medicineName, " by ", _manufacturerSubdomain))
            );
        }
    }
    
    /**
     * @dev Get the full ENS name for a medicine
     * @param _medicine The medicine contract address
     * @return The full ENS name (e.g., "aspirin.pfizer.oath.eth")
     */
    function getMedicineENSName(address _medicine) external view returns (string memory) {
        string memory subname = medicineToSubname[_medicine];
        require(bytes(subname).length > 0, "Medicine has no ENS subname");
        return string(abi.encodePacked(subname, ".", parentDomain));
    }
    
    /**
     * @dev Get medicine address from ENS subname
     * @param _subname The subname to look up
     * @return The medicine contract address
     */
    function getMedicineFromSubname(string calldata _subname) external view returns (address) {
        return subnameToMedicine[_subname];
    }
    
    /**
     * @dev Check if a medicine subname is available under a manufacturer
     * @param _medicineName The medicine name to check
     * @param _manufacturerSubdomain The manufacturer subdomain
     * @return True if available, false otherwise
     */
    function isMedicineSubnameAvailable(string calldata _medicineName, string calldata _manufacturerSubdomain) external view returns (bool) {
        string memory fullSubname = string(abi.encodePacked(_medicineName, ".", _manufacturerSubdomain));
        return subnameToMedicine[fullSubname] == address(0);
    }
    
    /**
     * @dev Check if a manufacturer subdomain is available
     * @param _subdomain The manufacturer subdomain to check
     * @return True if available, false otherwise
     */
    function isManufacturerSubdomainAvailable(string calldata _subdomain) external view returns (bool) {
        return subdomainToManufacturer[_subdomain] == address(0);
    }
    
    /**
     * @dev Get manufacturer address from subdomain
     * @param _subdomain The manufacturer subdomain to look up
     * @return The manufacturer address
     */
    function getManufacturerFromSubdomain(string calldata _subdomain) external view returns (address) {
        return subdomainToManufacturer[_subdomain];
    }
    
    /**
     * @dev Get manufacturer subdomain
     * @param _manufacturer The manufacturer address
     * @return The manufacturer subdomain
     */
    function getManufacturerSubdomain(address _manufacturer) external view returns (string memory) {
        return manufacturerToSubdomain[_manufacturer];
    }
    
    /**
     * @dev Get registry address from subdomain
     * @param _subdomain The registry subdomain to look up
     * @return The registry address
     */
    function getRegistryFromSubdomain(string calldata _subdomain) external view returns (address) {
        return subdomainToRegistry[_subdomain];
    }
    
    /**
     * @dev Get registry subdomain
     * @param _registry The registry address
     * @return The registry subdomain
     */
    function getRegistrySubdomain(address _registry) external view returns (string memory) {
        return registryToSubdomain[_registry];
    }
    
    /**
     * @dev Check if a registry subdomain is available
     * @param _subdomain The registry subdomain to check
     * @return True if available, false otherwise
     */
    function isRegistrySubdomainAvailable(string calldata _subdomain) external view returns (bool) {
        return subdomainToRegistry[_subdomain] == address(0);
    }
    
    /**
     * @dev Withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Required for ERC1155Holder
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
