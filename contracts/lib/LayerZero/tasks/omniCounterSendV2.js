const { getDeploymentAddresses } = require("../utils/readStatic")
const { CHAIN_KEY, CHAIN_LIST_ID, CHAIN_ID, CHAINLINK_ORACLE_CLIENTS, getEndpointIdByName } = require("@layerzerolabs/core-sdk")
const { getEndpointId } = require("../utils/network")

module.exports = async function (taskArgs, hre) {
    // get local OmniCounter instance so we can call incrementCounter()
    const OmniCounter = await ethers.getContractFactory("OmniCounter")
    const localAddr = (await hre.deployments.get("OmniCounter")).address
    const omniCounter = await OmniCounter.attach(localAddr)

    // get the destination information
    const targetNetworkAddrs = getDeploymentAddresses(taskArgs.targetNetwork)
    const targetUaAddr = targetNetworkAddrs["OmniCounter"]
    const targetEndpointId = getEndpointIdByName(taskArgs.targetNetwork)
    console.log(`sendOmniCounter [${getEndpointId()}] -> [${targetEndpointId}] @ dst UA: ${targetUaAddr}`)

    // send the counter, using *** V2 *** adapterParams
    let tx = await (
        await omniCounter.incrementCounterWithAdapterParamsV2(
            targetEndpointId,
            targetUaAddr,
            taskArgs.dstGasAmount,
            ethers.utils.parseEther(taskArgs.airdropEthQty),
            taskArgs.airdropAddr,
            { value: ethers.utils.parseEther("1") }
        )
    ).wait()
    console.log(`tx: ${tx.transactionHash}`)
}
