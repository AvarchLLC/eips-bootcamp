// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ETHShalaCoin (ESHC)
 * @notice Official ERC-20 utility & reward token of ETHShala on Base / Base Sepolia.
 * Powers the gamified student economy: quiz tournaments, quest bounties, marketplace items, and certifications.
 */

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

contract ETHShalaCoin is IERC20Metadata {
    string public constant override name = "ETHShala Coin";
    string public constant override symbol = "ESHC";
    uint8 public constant override decimals = 18;

    // Hard ceiling: 100,000,000 ESHC
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    uint256 private _totalSupply;
    address public owner;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => bool) public isMinter;

    event MinterUpdated(address indexed minter, bool authorized);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "ETHShalaCoin: caller is not the owner");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == owner || isMinter[msg.sender], "ETHShalaCoin: caller is not an authorized minter");
        _;
    }

    constructor(address initialMinter, uint256 initialTreasuryMint) {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);

        if (initialMinter != address(0)) {
            isMinter[initialMinter] = true;
            emit MinterUpdated(initialMinter, true);
        }

        // Optional initial treasury minting (e.g. 5,000,000 ESHC to founder/treasury)
        if (initialTreasuryMint > 0) {
            require(initialTreasuryMint <= MAX_SUPPLY, "Initial mint exceeds MAX_SUPPLY");
            _mint(msg.sender, initialTreasuryMint);
        }
    }

    // --- ERC20 View Functions ---

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function allowance(address tokenOwner, address spender) external view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    // --- ERC20 Mutative Functions ---

    function transfer(address to, uint256 value) external override returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external override returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external override returns (bool) {
        address spender = msg.sender;
        uint256 currentAllowance = _allowances[from][spender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= value, "ETHShalaCoin: insufficient allowance");
            unchecked {
                _approve(from, spender, currentAllowance - value);
            }
        }
        _transfer(from, to, value);
        return true;
    }

    // --- Minting & Burning ---

    /**
     * @notice Mints new ESHC to a recipient. Only callable by owner or authorized game/faucet contracts.
     * Enforces the immutable MAX_SUPPLY cap.
     */
    function mint(address to, uint256 amount) external onlyMinter returns (bool) {
        require(to != address(0), "ETHShalaCoin: cannot mint to zero address");
        require(_totalSupply + amount <= MAX_SUPPLY, "ETHShalaCoin: max supply exceeded");
        _mint(to, amount);
        return true;
    }

    /**
     * @notice Burns ESHC tokens from the caller's balance.
     */
    function burn(uint256 amount) external returns (bool) {
        _burn(msg.sender, amount);
        return true;
    }

    /**
     * @notice Burns ESHC tokens from another account, deducting from caller's allowance.
     */
    function burnFrom(address account, uint256 amount) external returns (bool) {
        uint256 currentAllowance = _allowances[account][msg.sender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ETHShalaCoin: insufficient allowance to burn");
            unchecked {
                _approve(account, msg.sender, currentAllowance - amount);
            }
        }
        _burn(account, amount);
        return true;
    }

    // --- Administration ---

    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        require(minter != address(0), "ETHShalaCoin: invalid minter address");
        isMinter[minter] = authorized;
        emit MinterUpdated(minter, authorized);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ETHShalaCoin: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // --- Internal Helpers ---

    function _transfer(address from, address to, uint256 value) internal {
        require(from != address(0), "ETHShalaCoin: transfer from zero address");
        require(to != address(0), "ETHShalaCoin: transfer to zero address");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= value, "ETHShalaCoin: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - value;
            _balances[to] += value;
        }

        emit Transfer(from, to, value);
    }

    function _mint(address account, uint256 amount) internal {
        _totalSupply += amount;
        unchecked {
            _balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ETHShalaCoin: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            _totalSupply -= amount;
        }
        emit Transfer(account, address(0), amount);
    }

    function _approve(address tokenOwner, address spender, uint256 value) internal {
        require(tokenOwner != address(0), "ETHShalaCoin: approve from zero address");
        require(spender != address(0), "ETHShalaCoin: approve to zero address");

        _allowances[tokenOwner][spender] = value;
        emit Approval(tokenOwner, spender, value);
    }
}
