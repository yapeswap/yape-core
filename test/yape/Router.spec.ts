import { ethers, waffle } from 'hardhat'
import chai, { expect } from 'chai'
import { Contract, constants, BigNumber } from 'ethers'

import { factoryFixture } from '../shared/fixtures'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { YapeRouter } from '../../src'
import { IERC20, IERC20__factory } from '@workhard/protocol'
import { manipulateDai, manipulateUsdc } from '../utils/manipulate'

chai.use(waffle.solidity)

const overrides = {
  gasLimit: 9999999,
}

describe('YapeRouter', () => {
  let dai: Contract
  let usdc: Contract
  let router: Contract
  let wallet: SignerWithAddress
  beforeEach(async function () {
    ;[wallet] = await ethers.getSigners()

    usdc = IERC20__factory.connect('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', wallet)
    dai = IERC20__factory.connect('0x6B175474E89094C44Da98b954EedeAC495271d0F', wallet)
    router = (await factoryFixture(wallet)).router as YapeRouter

    await manipulateDai(wallet.address, 10000)
    await manipulateUsdc(wallet.address, 10000)
  })

  it('quote', async () => {
    expect(await router.quote(BigNumber.from(1), BigNumber.from(100), BigNumber.from(200))).to.eq(BigNumber.from(2))
    expect(await router.quote(BigNumber.from(2), BigNumber.from(200), BigNumber.from(100))).to.eq(BigNumber.from(1))
    await expect(router.quote(BigNumber.from(0), BigNumber.from(100), BigNumber.from(200))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_AMOUNT'
    )
    await expect(router.quote(BigNumber.from(1), BigNumber.from(0), BigNumber.from(200))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.quote(BigNumber.from(1), BigNumber.from(100), BigNumber.from(0))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountOut', async () => {
    expect(await router.getAmountOut(BigNumber.from(2), BigNumber.from(100), BigNumber.from(100))).to.eq(
      BigNumber.from(1)
    )
    await expect(router.getAmountOut(BigNumber.from(0), BigNumber.from(100), BigNumber.from(100))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_INPUT_AMOUNT'
    )
    await expect(router.getAmountOut(BigNumber.from(2), BigNumber.from(0), BigNumber.from(100))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.getAmountOut(BigNumber.from(2), BigNumber.from(100), BigNumber.from(0))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountIn', async () => {
    expect(await router.getAmountIn(BigNumber.from(1), BigNumber.from(100), BigNumber.from(100))).to.eq(
      BigNumber.from(2)
    )
    await expect(router.getAmountIn(BigNumber.from(0), BigNumber.from(100), BigNumber.from(100))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_OUTPUT_AMOUNT'
    )
    await expect(router.getAmountIn(BigNumber.from(1), BigNumber.from(0), BigNumber.from(100))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.getAmountIn(BigNumber.from(1), BigNumber.from(100), BigNumber.from(0))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountsOut', async () => {
    await dai.approve(router.address, constants.MaxUint256)
    await usdc.approve(router.address, constants.MaxUint256)
    await router.addLiquidity(
      dai.address,
      usdc.address,
      BigNumber.from(10000),
      BigNumber.from(10000),
      0,
      0,
      wallet.address,
      constants.MaxUint256,
      overrides
    )

    await expect(router.getAmountsOut(BigNumber.from(2), [dai.address])).to.be.revertedWith('YapeLibrary: INVALID_PATH')
    const path = [dai.address, usdc.address]
    expect(await router.getAmountsOut(BigNumber.from(2), path)).to.deep.eq([BigNumber.from(2), BigNumber.from(1)])
  })

  it('getAmountsIn', async () => {
    await dai.approve(router.address, constants.MaxUint256)
    await usdc.approve(router.address, constants.MaxUint256)
    await router.addLiquidity(
      dai.address,
      usdc.address,
      BigNumber.from(10000),
      BigNumber.from(10000),
      0,
      0,
      wallet.address,
      constants.MaxUint256,
      overrides
    )

    await expect(router.getAmountsIn(BigNumber.from(1), [dai.address])).to.be.revertedWith('YapeLibrary: INVALID_PATH')
    const path = [dai.address, usdc.address]
    expect(await router.getAmountsIn(BigNumber.from(1), path)).to.deep.eq([BigNumber.from(2), BigNumber.from(1)])
  })
})

describe('YapeRouter', () => {
  let usdc: IERC20
  let dai: IERC20
  let router: YapeRouter
  let wallet: SignerWithAddress
  beforeEach(async function () {
    ;[wallet] = await ethers.getSigners()
    console.log('wallet address', wallet.address)
    usdc = IERC20__factory.connect('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', wallet)
    dai = IERC20__factory.connect('0x6B175474E89094C44Da98b954EedeAC495271d0F', wallet)
    router = (await factoryFixture(wallet)).router as YapeRouter
    await manipulateDai(wallet.address, 10000)
    await manipulateUsdc(wallet.address, 10000)
  })

  it('quote', async () => {
    expect(await router.quote(BigNumber.from(1), BigNumber.from(100), BigNumber.from(200))).to.eq(BigNumber.from(2))
    expect(await router.quote(BigNumber.from(2), BigNumber.from(200), BigNumber.from(100))).to.eq(BigNumber.from(1))
    await expect(router.quote(BigNumber.from(0), BigNumber.from(100), BigNumber.from(200))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_AMOUNT'
    )
    await expect(router.quote(BigNumber.from(1), BigNumber.from(0), BigNumber.from(200))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.quote(BigNumber.from(1), BigNumber.from(100), BigNumber.from(0))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountOut', async () => {
    expect(await router.getAmountOut(BigNumber.from(2), BigNumber.from(100), BigNumber.from(100))).to.eq(
      BigNumber.from(1)
    )
    await expect(router.getAmountOut(BigNumber.from(0), BigNumber.from(100), BigNumber.from(100))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_INPUT_AMOUNT'
    )
    await expect(router.getAmountOut(BigNumber.from(2), BigNumber.from(0), BigNumber.from(100))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.getAmountOut(BigNumber.from(2), BigNumber.from(100), BigNumber.from(0))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountIn', async () => {
    expect(await router.getAmountIn(BigNumber.from(1), BigNumber.from(100), BigNumber.from(100))).to.eq(
      BigNumber.from(2)
    )
    await expect(router.getAmountIn(BigNumber.from(0), BigNumber.from(100), BigNumber.from(100))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_OUTPUT_AMOUNT'
    )
    await expect(router.getAmountIn(BigNumber.from(1), BigNumber.from(0), BigNumber.from(100))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.getAmountIn(BigNumber.from(1), BigNumber.from(100), BigNumber.from(0))).to.be.revertedWith(
      'YapeLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountsOut', async () => {
    await dai.approve(router.address, constants.MaxUint256)
    await usdc.approve(router.address, constants.MaxUint256)
    await router.addLiquidity(
      dai.address,
      usdc.address,
      BigNumber.from(10000),
      BigNumber.from(10000),
      0,
      0,
      wallet.address,
      constants.MaxUint256,
      overrides
    )

    await expect(router.getAmountsOut(BigNumber.from(2), [dai.address])).to.be.revertedWith('YapeLibrary: INVALID_PATH')
    const path = [dai.address, usdc.address]
    expect(await router.getAmountsOut(BigNumber.from(2), path)).to.deep.eq([BigNumber.from(2), BigNumber.from(1)])
  })

  it('getAmountsIn', async () => {
    await dai.approve(router.address, constants.MaxUint256)
    await usdc.approve(router.address, constants.MaxUint256)
    await router.addLiquidity(
      dai.address,
      usdc.address,
      BigNumber.from(10000),
      BigNumber.from(10000),
      0,
      0,
      wallet.address,
      constants.MaxUint256,
      overrides
    )

    await expect(router.getAmountsIn(BigNumber.from(1), [dai.address])).to.be.revertedWith('YapeLibrary: INVALID_PATH')
    const path = [dai.address, usdc.address]
    expect(await router.getAmountsIn(BigNumber.from(1), path)).to.deep.eq([BigNumber.from(2), BigNumber.from(1)])
  })
})
