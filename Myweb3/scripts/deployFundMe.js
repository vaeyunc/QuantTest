// import ethers.js
//create main function
    /*init 2 accounts
    fund contract with first account
    check balance of contract
    fund contract with second account
    check balance of contract
    check mapping fundersToAmount*/
// execute the main function

const {ethers} = require("hardhat");

async function main() {
    //create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract deploying")
    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(300)
    await fundMe.waitForDeployment()
    console.log("contract has been deployed successfully, contract address is" + fundMe.target);
    // console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`); #another way to output 
    await fundMe.deploymentTransaction().wait(5)
    console.log("Waiting for 5 confirmations")
    
    // verify fundMe contract
    if(hre.network.config.chainId == 43113 && process.env.ETHESCAN_API_KEY) {
        console.log("waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5)
        await verifyFundMe(fundMe.target, [300])
    
    }else{
        console.log("verification skipped")
    }
    
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

}



async function verifyFundMe(fundMeAddr, args) {
    await fundMe.deploymentTransaction.wait(5)
    console.log("Waiting for 5 confirmations")

    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
      });
}

main().then().catch((error) => {
    console.error(error)
    process.exit(0)
})