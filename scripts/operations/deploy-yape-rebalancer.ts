import hre from 'hardhat'

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const YapeRebalancer = (await hre.ethers.getContractFactory('YapeRebalancer')).connect(signer)
  const rebalancer = await YapeRebalancer.deploy()
  console.log('YapeRebalancer deployed to:', rebalancer.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
