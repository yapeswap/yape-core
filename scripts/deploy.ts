export const MAINNET_DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
export const MAINNET_WEHT9 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
export const MAINNET_YEARN_V2_REGISTRY = `0x50c1a2ea0a861a967d9d0ffe2ae4012c2e053804`
export const WHF_DIVIDEND_POOL = `0xe2Bc819B52AE921248F44B2d5c2dDE93b731Ce4e`

import hre from 'hardhat'

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const YapeFactory = (await hre.ethers.getContractFactory('YapeFactory')).connect(signer)
  const YapePairCode = (await hre.ethers.getContractFactory('YapePairCode')).connect(signer)
  const YapeRouter = (await hre.ethers.getContractFactory('UniswapV2Router02')).connect(signer)
  const FeeManager = (await hre.ethers.getContractFactory('FeeManager')).connect(signer)

  const pairCode = await YapePairCode.deploy()
  const factory = await YapeFactory.deploy(signer.address, MAINNET_YEARN_V2_REGISTRY, signer.address, pairCode.address)
  const feeManager = await FeeManager.deploy(
    signer.address,
    '0xe2Bc819B52AE921248F44B2d5c2dDE93b731Ce4e',
    MAINNET_DAI,
    MAINNET_WEHT9
  )
  const yapeRouter = await YapeRouter.deploy(factory.address, MAINNET_WEHT9)
  console.log('PairCode deployed to:', pairCode.address)
  console.log('Factory deployed to:', factory.address)
  console.log('FeeManager deployed to:', feeManager.address)
  console.log('Router deployed to:', yapeRouter.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
