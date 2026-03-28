// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PrizeVault is Ownable {
    IERC20 public crushToken;
    mapping(address => uint256) public claimableRewards;

    event RewardAdded(address indexed player, uint256 amount);
    event RewardClaimed(address indexed player, uint256 amount);

    constructor(address _crushToken, address initialOwner) Ownable(initialOwner) {
        crushToken = IERC20(_crushToken);
    }

    function addReward(address[] calldata players, uint256[] calldata amounts) external onlyOwner {
        require(players.length == amounts.length, "Arrays length mismatch");
        for (uint256 i = 0; i < players.length; i++) {
            claimableRewards[players[i]] += amounts[i];
            emit RewardAdded(players[i], amounts[i]);
        }
    }

    function claim() external {
        uint256 amount = claimableRewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        require(crushToken.balanceOf(address(this)) >= amount, "Insufficient vault balance");

        claimableRewards[msg.sender] = 0;
        crushToken.transfer(msg.sender, amount);

        emit RewardClaimed(msg.sender, amount);
    }

    // Allow owner to withdraw accidentally sent tokens or to rebalance
    function withdraw(uint256 amount) external onlyOwner {
        require(crushToken.balanceOf(address(this)) >= amount, "Insufficient vault balance");
        crushToken.transfer(owner(), amount);
    }
}
