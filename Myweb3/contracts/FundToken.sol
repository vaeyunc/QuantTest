//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FundToken {
    string public tokenName;
    string public tokenSymbol;
    uint256 public totalSupply;
    address public owner;
    mapping(address => uint256) public balances;

    constructor(string memory _tokenName, string memory _tokenSymbol ) {
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        owner = msg.sender;

    }

    // mint: get token
    function mint(uint256 amountToMint) public {
        balances[msg.sender] += amountToMint;
        totalSupply += amountToMint;
    }

    // transfer: transfer token
    function transfer(address payee, uint256 amount) public {
        require(balances[msg.sender] >= amount, "You do not have enough balance to transfer");
        balances[msg.sender] -= amount;
        totalSupply += amount;
    }

    // balanceOfamount: check someone address token amount
    function balanceOf(address addr) public view returns (uint256) {
        return balances[addr];
    }
}