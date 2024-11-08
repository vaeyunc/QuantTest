const { ethers } = require("hardhat");

// async function checkAccounts() {
//     const [firstAccount, secondAccount] = await ethers.getSigners();
//     console.log(`First account address: ${firstAccount.address}`);
//     console.log(`Second account address: ${secondAccount.address}`);
// }
async function main() {
    console.log("Network URL:", process.env.SEPOLIA_URL);
    console.log("Current network:", network.name);
    
    // Try to get the provider
    const provider = ethers.provider;
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log("Current block number:", blockNumber);
    } catch (error) {
        console.error("Provider error:", error.message);
    }
}

// checkAccounts().catch((error) => {
main().catch((error) => {
    console.error(error);
    process.exit(1);
});