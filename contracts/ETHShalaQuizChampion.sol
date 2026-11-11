// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ETHShalaQuizChampion
 * @notice Official ERC-721 Championship Trophy NFT for the ETHShala Quiz League on Gnosis Chain.
 * Awarded to the #1 weekly winner of each competitive quiz tournament.
 */

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract ETHShalaQuizChampion {
    string public name = "ETHShala Quiz League Champion";
    string public symbol = "ETHSHALA-CUP";

    address public owner;
    address public authorizedMinter;

    uint256 private _nextTokenId = 1000;

    // Token ID => Token URI
    mapping(uint256 => string) private _tokenURIs;
    // Token ID => Owner
    mapping(uint256 => address) private _owners;
    // Owner => Balance
    mapping(address => uint256) private _balances;
    // Week Number => Token ID (One champion NFT per weekly competition)
    mapping(uint256 => uint256) public weekToTokenId;
    // Token ID => Week Number
    mapping(uint256 => uint256) public tokenIdToWeek;

    event TrophyMinted(
        uint256 indexed weekNumber,
        uint256 indexed tokenId,
        address indexed recipient,
        string tokenURI
    );
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == authorizedMinter || msg.sender == owner, "Not authorized minter");
        _;
    }

    constructor(address _minter) {
        owner = msg.sender;
        authorizedMinter = _minter != address(0) ? _minter : msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function setAuthorizedMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Invalid minter address");
        emit MinterUpdated(authorizedMinter, _minter);
        authorizedMinter = _minter;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @notice Mints the unique Weekly Champion Trophy to the winner's wallet.
     * Enforces exactly 1 trophy per competition week.
     */
    function mintChampionTrophy(
        address recipient,
        uint256 weekNumber,
        string calldata uri
    ) external onlyMinter returns (uint256) {
        require(recipient != address(0), "Recipient is zero address");
        require(weekToTokenId[weekNumber] == 0, "Champion trophy already minted for this week");

        uint256 tokenId = ++_nextTokenId;

        _owners[tokenId] = recipient;
        _balances[recipient] += 1;
        _tokenURIs[tokenId] = uri;
        weekToTokenId[weekNumber] = tokenId;
        tokenIdToWeek[tokenId] = weekNumber;

        emit TrophyMinted(weekNumber, tokenId, recipient, uri);

        return tokenId;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token does not exist");
        return tokenOwner;
    }

    function balanceOf(address account) external view returns (uint256) {
        require(account != address(0), "Zero address query");
        return _balances[account];
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x80ac58cd // ERC-721
            || interfaceId == 0x5b5e139f // ERC-721 Metadata
            || interfaceId == 0x01ffc9a7; // ERC-165
    }
}
