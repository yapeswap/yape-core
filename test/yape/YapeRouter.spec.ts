import { ethers, waffle } from 'hardhat'
import chai, { expect } from 'chai'
import { constants } from 'ethers'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { YapeFactory, YapeFactory__factory, YapePair, YapePair__factory, YapeRouter } from '../../src'
import { IERC20, IERC20__factory } from '@workhard/protocol'
import { manipulateDai, manipulateUsdc } from '../utils/manipulate'
import { parseEther } from 'ethers/lib/utils'
import { MAINNET_WEHT9 } from '../shared/fixtures'

chai.use(waffle.solidity)

const overrides = {
  gasLimit: 9999999,
}

describe('YapeRouter', () => {
  let dai: IERC20
  let usdc: IERC20
  let router: YapeRouter
  let factory: YapeFactory
  let pair: YapePair
  let wallet: SignerWithAddress
  beforeEach(async function () {
    ;[wallet] = await ethers.getSigners()

    usdc = IERC20__factory.connect('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', wallet)
    dai = IERC20__factory.connect('0x6B175474E89094C44Da98b954EedeAC495271d0F', wallet)
    factory = YapeFactory__factory.connect('0x46aDc1C052Fafd590F56C42e379d7d16622835a2', wallet)
    pair = YapePair__factory.connect(await factory.getPair(usdc.address, dai.address), wallet)
    // router = YapeRouter__factory.connect('0xa907768665f977c1A03B8D196AB3EC5c81F1bbcb', wallet)
    router = await (await ethers.getContractFactory('YapeRouter'))
      .connect(wallet)
      .deploy(factory.address, MAINNET_WEHT9)
    await usdc.approve(router.address, constants.MaxUint256)
    await dai.approve(router.address, constants.MaxUint256)
    await manipulateDai(wallet.address, 10000)
    await manipulateUsdc(wallet.address, 10000)
  })

  it('swapExactTokensForTokens', async () => {
    const [reserve0, reserve1] = await pair.getReserves()
    const amountIn = parseEther('10')
    const amountOut = await router.getAmountOut(parseEther('10'), reserve0, reserve1)
    const path = [dai.address, usdc.address]
    await expect(
      router.swapExactTokensForTokens(amountIn, amountOut, path, wallet.address, constants.MaxUint256)
    ).to.emit(pair, 'Swap')
  })
  it('swapExactTokensForTokensSupportingFeeOnTransferTokens', async () => {
    const [reserve0, reserve1] = await pair.getReserves()
    const amountIn = parseEther('10')
    const amountOut = await router.getAmountOut(parseEther('10'), reserve0, reserve1)
    const path = [dai.address, usdc.address]
    await expect(
      router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIn,
        amountOut,
        path,
        wallet.address,
        constants.MaxUint256
      )
    ).to.emit(pair, 'Swap')
  })
})
