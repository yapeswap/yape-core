const MAINNET_WEHT9 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const YAPE_SWAP_TIMELOCK_CONTRACT = `0x463Ee0E829C8AB20e47A495D47cd8D3C0cA78D8B`
const YAPE_ADDRESS = `0x757BC268bd50DA88b2d0cf1966652B18e56CA803`
const YAPE_DIVIDEND_POOL = `0xD3Eb5537c349781F483bB556b3b1371A442338fc`

import hre from 'hardhat'

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const FeeManager = (await hre.ethers.getContractFactory('FeeManager')).connect(signer)
  const feeManager = await FeeManager.deploy(signer.address, YAPE_DIVIDEND_POOL, YAPE_ADDRESS, MAINNET_WEHT9)
  console.log('prev tx count:', await signer.getTransactionCount())
  console.log('FeeManager deployed to:', feeManager.address)
  console.log('next tx count:', await signer.getTransactionCount())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
