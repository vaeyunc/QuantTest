const {task} = require("hardhat/config")

task("interact-fundMe", "interact with fundMe contract").addParam("addr", "fundme contract address").setAction(async(taskArgs, hre) => {
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = fundMeFactory.attach(taskArgs.addr)
// init 2 accounts
    const[firstAccount, secondAccount] = await ethers.getSigner()
    console.log(`First account address: ${firstAccount.address}`);
    console.log(`Second account address: ${secondAccount.address}`);
// fund contract with first account
    const fundTx = await fundMe.fund({value:ethers.parseEther("0.01")})
    await fundTx.wait()
// check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`contract balance is ${ethers.formatEther(balanceOfContract)}`)
//fund contract with second account
    const fundTx2 = await fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.01")})
    await fundTx2.wait()
// check balance of contract
    const balanceOfContract2 = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${ethers.formatEther(balanceOfContract2)}`)
// check mapping
    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`Balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
    console.log(`Balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)

})

module.exports = {};