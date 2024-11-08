// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 创建一个收款函数
// 记录投资人并且查看
// 在锁定期内，达到到目标值，生产商可以提款
// 在锁定期内，没有达到到目标值，投资人在锁定期以后退款

contract FundMe {
    mapping (address => uint256) public fundersToAmount;

    uint256 constant MINIMUM_VALUE = 100 * 10 ** 18; //wei

    AggregatorV3Interface internal dataFeed;

    uint256 constant TARGET = 1000 * 10 ** 18;
    address public Owner;

    uint256 deploymentTimestamp;
    uint256 lockTime;

    address erc20Addr;
    bool public getFundSuccess = false;

    constructor(uint256 _lockTime) {
        if(block.chainid == 11155111) {
            dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        } else if (block.chainid == 43113) {
            dataFeed = AggregatorV3Interface(0x5498BB86BC934c8D34FDA08E81D444153d0D06aD);
        }
       Owner = msg.sender;
       deploymentTimestamp = block.timestamp;
       lockTime = _lockTime;
    }

    function fund() external payable {
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        // require(block.timestamp < deploymentTimestamp + lockTime, "window is closed");
        fundersToAmount[msg.sender] = msg.value;

    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns (uint256) {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
        
    }

    function transferOwnerShip(address newOwner) public onlyOwner {       
        Owner = newOwner;
    }

    function getFund() external windowClose onlyOwner {
        require(convertEthToUsd(address(this).balance) >= TARGET, "Target is not reached");
        // require(block.timestamp >= deploymentTimestamp + lockTime, "window is not closed");
        
        // transfer: transfer ETH and revert if tx failed
        // payable(msg.sender).transfer(address(this).balance);

        // send: transfer ETH and return false if failed
        // bool success = payable (msg.sender).send(address(this).balance);
        // require(success, "tx failed")

        // call:transfer ETH with data return value of function and bool
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "transfer tx failed");

    }

    function refund() external windowClose{
        require(convertEthToUsd(address(this).balance) < TARGET, "Target is reached");
        require(fundersToAmount[msg.sender] != 0, "there is no fund for you");
        // require(block.timestamp >= deploymentTimestamp + lockTime, "window is not closed"); //统一在windowsclose中
        bool success;
        (success, ) = payable(msg.sender).call{value: fundersToAmount[msg.sender]}("");
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0;
        getFundSuccess = true;
    }

    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr, "You do not have the right to call this function");
        fundersToAmount[funder] = amountToUpdate;

    }

    function setErc20Addr(address _erc20Addr) public onlyOwner {
        erc20Addr = _erc20Addr;
    }

    modifier windowClose() {
        require(block.timestamp < deploymentTimestamp + lockTime, "window is closed");
        _;

    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "this function can  only be called by Owner");
        _;

    }

}



