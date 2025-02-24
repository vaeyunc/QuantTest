const {task} = require("hardhat/config")

task("deploy-fundme").setAction(async(taskArgs, hre) => {
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
    if(hre.network.config.chainId == 11155111 && process.env.ETHESCAN_API_KEY) {
        console.log("waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5)
        await verifyFundMe(fundMe.target, [300])
    
    } else {
        console.log("verification skipped")
    }
    
})

async function verifyFundMe(fundMeAddr, args) {
    await fundMe.deploymentTransaction.wait(5)
    console.log("Waiting for 5 confirmations")

    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
      });
}



module.exports = {}