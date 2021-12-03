pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IExerciceSolution.sol";

contract ExerciceSolution is ERC20
{   
	event displayValue(uint256 value);

	constructor (string memory name_, string memory symbol_, uint256 initialSupply) public ERC20(name_, symbol_){
        _mint(address(this), initialSupply * 10 ** 18);
	}
	
	function getToken() external returns (bool){
		_approve(address(this), msg.sender, 1);
		transferFrom(address(this), msg.sender, 1);
		return true;
	}

	function buyToken() external payable returns (bool){
		require(msg.value > 0, "Quantity must be greater than 0");
		// require(msg.value > balanceOf(address(this)), "Not enough token to buy");
		_approve(address(this), msg.sender, msg.value);
		transferFrom(address(this), msg.sender, msg.value);
		return true;
	}

	function isCustomerWhiteListed(address customerAddress) external returns (bool){
		return true;
	}

	function customerTierLevel(address customerAddress) external returns (uint256){
		return 101;
	}

}
