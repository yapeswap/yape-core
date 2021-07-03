import { ethers, waffle } from 'hardhat'
import chai, { expect } from 'chai'
import { constants, BigNumber } from 'ethers'

import { expandTo18Decimals, mineBlock, encodePrice } from '../shared/utilities'
import { factoryFixture, MAINNET_DAI, MAINNET_WEHT9, whfFixtures } from '../shared/fixtures'
import { IERC20, IERC20__factory, YapeFactory, YapePair } from '../../src'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { FeeManager } from '@workhard/utils'
import { parseEther } from 'ethers/lib/utils'
import { manipulateDai } from '../utils/manipulate'

const MINIMUM_LIQUIDITY = BigNumber.from(10).pow(3)

chai.use(waffle.solidity)

const { AddressZero } = constants
const provider = waffle.provider

describe('YapePair with Farming', () => {
  let snapshot: string
  let wallet: SignerWithAddress, other: SignerWithAddress
  let factory: YapeFactory
  let pair: YapePair
  let feeManager: FeeManager
  let dai: IERC20
  let weth: IERC20
  before(async () => {
    ;[wallet, other] = await ethers.getSigners()
    factory = (await factoryFixture(wallet)).factory as YapeFactory
    const fixtures = await whfFixtures({
      signer: wallet,
    })
    feeManager = fixtures.feeManager
    dai = IERC20__factory.connect(MAINNET_DAI, wallet)
    weth = IERC20__factory.connect(MAINNET_WEHT9, wallet)
    // prepare dai (DAI)
    await manipulateDai(wallet.address, 10000)
    // prepare weth (WETH)
    await other.sendTransaction({ to: wallet.address, value: parseEther('10') })
    await wallet.sendTransaction({ to: MAINNET_WEHT9, value: parseEther('10000') })
    // check balance
    expect(await weth.balanceOf(wallet.address)).to.eq(parseEther('10000'))
    expect(await dai.balanceOf(wallet.address)).to.eq(parseEther('10000'))
    // deploy pair
    await factory.createPair(dai.address, weth.address)
    const pairAddress = await factory.getPair(dai.address, weth.address)
    pair = (await ethers.getContractAt('YapePair', pairAddress, wallet)) as YapePair
    // set fee to
    await factory.setFeeTo(feeManager.address)
    // set farming ratio
    await pair.setFarmingRatio(8000, 10000)
  })
  beforeEach(async () => {
    snapshot = await ethers.provider.send('evm_snapshot', [])
  })
  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshot])
  })

  it('mint', async () => {
    const daiAmount = expandTo18Decimals(1)
    const wethAmount = expandTo18Decimals(4)
    await dai.transfer(pair.address, daiAmount)
    await weth.transfer(pair.address, wethAmount)

    const expectedLiquidity = expandTo18Decimals(2)
    await expect(pair.mint(wallet.address))
      .to.emit(pair, 'Transfer')
      .withArgs(AddressZero, AddressZero, MINIMUM_LIQUIDITY)
      .to.emit(pair, 'Transfer')
      .withArgs(AddressZero, wallet.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      .to.emit(pair, 'Sync')
      .withArgs(daiAmount, wethAmount)
      .to.emit(pair, 'Mint')
      .withArgs(wallet.address, daiAmount, wethAmount)
      .to.emit(pair, 'YearnDeposit')
      .withArgs(dai.address, daiAmount.mul(9000).div(10000))
      .to.emit(pair, 'YearnDeposit')
      .withArgs(weth.address, wethAmount.mul(9000).div(10000))

    expect(await pair.totalSupply()).to.eq(expectedLiquidity)
    expect(await pair.balanceOf(wallet.address)).to.eq(expectedLiquidity.sub(MINIMUM_LIQUIDITY))
    expect(await dai.balanceOf(pair.address)).to.eq(daiAmount.div(10))
    expect(await weth.balanceOf(pair.address)).to.eq(wethAmount.div(10))
    const reserves = await pair.getReserves()
    expect(reserves[0]).to.eq(daiAmount)
    expect(reserves[1]).to.eq(wethAmount)
  })

  async function addLiquidity(daiAmount: BigNumber, wethAmount: BigNumber) {
    await dai.transfer(pair.address, daiAmount)
    await weth.transfer(pair.address, wethAmount)
    await pair.mint(wallet.address)
  }

  const swapTestCases: BigNumber[][] = [
    [1, 5, 10, '1662497915624478906'],
    [1, 10, 5, '453305446940074565'],

    [2, 5, 10, '2851015155847869602'],
    [2, 10, 5, '831248957812239453'],

    [1, 10, 10, '906610893880149131'],
    [1, 100, 100, '987158034397061298'],
    [1, 1000, 1000, '996006981039903216'],
  ].map((a) => a.map((n) => (typeof n === 'string' ? BigNumber.from(n) : expandTo18Decimals(n))))
  swapTestCases.forEach((swapTestCase, i) => {
    it(`getInputPrice:${i}`, async () => {
      const [swapAmount, daiAmount, wethAmount, expectedOutputAmount] = swapTestCase
      await addLiquidity(daiAmount, wethAmount)
      await dai.transfer(pair.address, swapAmount)
      await expect(pair.swap(0, expectedOutputAmount.add(1), wallet.address, '0x')).to.be.revertedWith('UniswapV2: K')
      await pair.swap(0, BigNumber.from('1'), wallet.address, '0x')
    })
  })

  const optimisticTestCases: BigNumber[][] = [
    ['997000000000000000', 5, 10, 1], // given amountIn, amountOut = floor(amountIn * .997)
    ['997000000000000000', 10, 5, 1],
    ['997000000000000000', 5, 5, 1],
    [1, 5, 5, '1003009027081243732'], // given amountOut, amountIn = ceiling(amountOut / .997)
  ].map((a) => a.map((n) => (typeof n === 'string' ? BigNumber.from(n) : expandTo18Decimals(n))))
  optimisticTestCases.forEach((optimisticTestCase, i) => {
    it(`optimistic:${i}`, async () => {
      const [outputAmount, daiAmount, wethAmount, inputAmount] = optimisticTestCase
      await addLiquidity(daiAmount, wethAmount)
      await dai.transfer(pair.address, inputAmount)
      await expect(pair.swap(outputAmount.add(1), 0, wallet.address, '0x')).to.be.revertedWith('UniswapV2: K')
      await pair.swap(outputAmount, 0, wallet.address, '0x')
    })
  })

  it('swap:dai', async () => {
    const daiAmount = expandTo18Decimals(5)
    const wethAmount = expandTo18Decimals(10)
    await addLiquidity(daiAmount, wethAmount)

    const swapAmount = expandTo18Decimals(1)
    const expectedOutputAmount = BigNumber.from('1662497915624478906')
    await dai.transfer(pair.address, swapAmount)
    await expect(pair.swap(0, expectedOutputAmount, wallet.address, '0x'))
      .to.emit(weth, 'Transfer')
      .withArgs(pair.address, wallet.address, expectedOutputAmount)
      .to.emit(pair, 'Sync')
      .withArgs(daiAmount.add(swapAmount), wethAmount.sub(expectedOutputAmount))
      .to.emit(pair, 'Swap')
      .withArgs(wallet.address, swapAmount, 0, 0, expectedOutputAmount, wallet.address)

    const reserves = await pair.getReserves()
    expect(reserves[0]).to.eq(daiAmount.add(swapAmount))
    expect(reserves[1]).to.eq(wethAmount.sub(expectedOutputAmount))
    expect((await dai.balanceOf(pair.address)).add(await pair.farming(dai.address))).to.eq(daiAmount.add(swapAmount))
    expect((await weth.balanceOf(pair.address)).add(await pair.farming(weth.address))).to.eq(
      wethAmount.sub(expectedOutputAmount)
    )
    expect(await dai.balanceOf(wallet.address)).to.eq(parseEther('10000').sub(daiAmount).sub(swapAmount))
    expect(await weth.balanceOf(wallet.address)).to.eq(parseEther('10000').sub(wethAmount).add(expectedOutputAmount))
  })

  it('swap:weth', async () => {
    const daiAmount = expandTo18Decimals(5)
    const wethAmount = expandTo18Decimals(10)
    await addLiquidity(daiAmount, wethAmount)

    const swapAmount = expandTo18Decimals(1)
    const expectedOutputAmount = BigNumber.from('453305446940074565')
    await weth.transfer(pair.address, swapAmount)
    await expect(pair.swap(expectedOutputAmount, 0, wallet.address, '0x'))
      .to.emit(dai, 'Transfer')
      .withArgs(pair.address, wallet.address, expectedOutputAmount)
      .to.emit(pair, 'Sync')
      .withArgs(daiAmount.sub(expectedOutputAmount), wethAmount.add(swapAmount))
      .to.emit(pair, 'Swap')
      .withArgs(wallet.address, 0, swapAmount, expectedOutputAmount, 0, wallet.address)

    const reserves = await pair.getReserves()
    expect(reserves[0]).to.eq(daiAmount.sub(expectedOutputAmount))
    expect(reserves[1]).to.eq(wethAmount.add(swapAmount))
    expect((await dai.balanceOf(pair.address)).add(await pair.farming(dai.address))).to.eq(
      daiAmount.sub(expectedOutputAmount)
    )
    expect((await weth.balanceOf(pair.address)).add(await pair.farming(weth.address))).to.eq(wethAmount.add(swapAmount))
    expect(await dai.balanceOf(wallet.address)).to.eq(parseEther('10000').sub(daiAmount).add(expectedOutputAmount))
    expect(await weth.balanceOf(wallet.address)).to.eq(parseEther('10000').sub(wethAmount).sub(swapAmount))
  })

  it('swap:gas', async () => {
    const daiAmount = expandTo18Decimals(5)
    const wethAmount = expandTo18Decimals(10)
    await addLiquidity(daiAmount, wethAmount)

    // ensure that setting price{0,1}CumulativeLast for the first time doesn't affect our gas math
    await mineBlock((await provider.getBlock('latest')).timestamp + 1)
    await pair.sync()

    const swapAmount = expandTo18Decimals(1)
    const expectedOutputAmount = BigNumber.from('453305446940074565')
    await weth.transfer(pair.address, swapAmount)
    await mineBlock((await provider.getBlock('latest')).timestamp + 1)
    const tx = await pair.swap(expectedOutputAmount, 0, wallet.address, '0x')
    const receipt = await tx.wait()
    expect(receipt.gasUsed).to.eq(87882)
  })

  it('swap:rebalance', async () => {
    const daiAmount = expandTo18Decimals(5)
    const wethAmount = expandTo18Decimals(10)
    await addLiquidity(daiAmount, wethAmount)

    // ensure that setting price{0,1}CumulativeLast for the first time doesn't affect our gas math
    await mineBlock((await provider.getBlock('latest')).timestamp + 1)
    await pair.sync()

    const swapAmount = expandTo18Decimals(1)
    const expectedOutputAmount = BigNumber.from('453305446940074565')
    await weth.transfer(pair.address, swapAmount)
    await mineBlock((await provider.getBlock('latest')).timestamp + 1)
    // swap and do rebalance
    await pair.swap(expectedOutputAmount, 0, wallet.address, '0x')
    expect(await pair.rebalance(dai.address)).to.emit(pair, 'YearnWithdraw')
    expect(await pair.rebalance(weth.address)).to.emit(pair, 'YearnDeposit')
  })

  it.skip('swap:yield', async () => {
    const daiAmount = expandTo18Decimals(5)
    const wethAmount = expandTo18Decimals(10)
    await addLiquidity(daiAmount, wethAmount)

    // ensure that setting price{0,1}CumulativeLast for the first time doesn't affect our gas math
    await mineBlock((await provider.getBlock('latest')).timestamp + 1)
    await pair.sync()

    const swapAmount = expandTo18Decimals(1)
    const expectedOutputAmount = BigNumber.from('453305446940074565')
    await weth.transfer(pair.address, swapAmount)
    await mineBlock((await provider.getBlock('latest')).timestamp + 1)
    // swap and do rebalance
    await pair.swap(expectedOutputAmount, 0, wallet.address, '0x')
    // TODO need Mock Yearn Vaults
    // await mockYearn.increaseYield(dai.address, parseEther("1000"))
    // await mockYearn.increaseYield(weth.address, parseEther("1000"))
    await pair.rebalance(dai.address)
    await pair.rebalance(weth.address)
    // Yield check
    expect(await dai.balanceOf(feeManager.address)).not.to.eq(0)
    expect(await weth.balanceOf(feeManager.address)).not.to.eq(0)
  })

  it('burn', async () => {
    const daiAmount = expandTo18Decimals(3)
    const wethAmount = expandTo18Decimals(3)
    await addLiquidity(daiAmount, wethAmount)

    const expectedLiquidity = expandTo18Decimals(3)
    await pair.transfer(pair.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
    await expect(pair.burn(wallet.address))
      .to.emit(pair, 'Transfer')
      .withArgs(pair.address, AddressZero, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      .to.emit(dai, 'Transfer')
      .withArgs(pair.address, wallet.address, daiAmount.sub(1000))
      .to.emit(weth, 'Transfer')
      .withArgs(pair.address, wallet.address, wethAmount.sub(1000))
      .to.emit(pair, 'Sync')
      .withArgs(1000, 1000)
      .to.emit(pair, 'Burn')
      .withArgs(wallet.address, daiAmount.sub(1000), wethAmount.sub(1000), wallet.address)

    expect(await pair.balanceOf(wallet.address)).to.eq(0)
    expect(await pair.totalSupply()).to.eq(MINIMUM_LIQUIDITY)
    expect((await dai.balanceOf(pair.address)).add(await pair.farming(dai.address))).to.eq(1000)
    expect((await weth.balanceOf(pair.address)).add(await pair.farming(weth.address))).to.eq(1000)
    expect(await dai.balanceOf(wallet.address)).to.eq(parseEther('10000').sub(1000))
    expect(await weth.balanceOf(wallet.address)).to.eq(parseEther('10000').sub(1000))
  })

  it('price{0,1}CumulativeLast', async () => {
    const daiAmount = expandTo18Decimals(3)
    const wethAmount = expandTo18Decimals(3)
    await addLiquidity(daiAmount, wethAmount)

    const blockTimestamp = (await pair.getReserves())[2]
    await mineBlock(blockTimestamp + 1)
    await pair.sync()
    const initialPrice = encodePrice(daiAmount, wethAmount)
    const updatedTimestamp = (await pair.getReserves())[2]
    expect(await pair.price0CumulativeLast()).to.eq(initialPrice[0].mul(updatedTimestamp - blockTimestamp))
    expect(await pair.price1CumulativeLast()).to.eq(initialPrice[1].mul(updatedTimestamp - blockTimestamp))

    const swapAmount = expandTo18Decimals(3)
    await dai.transfer(pair.address, swapAmount)
    await mineBlock(blockTimestamp + 10)
    // swap to a new price eagerly instead of syncing
    await pair.swap(0, expandTo18Decimals(1), wallet.address, '0x') // make the price nice

    const updatedTimestamp2 = (await pair.getReserves())[2]
    expect(await pair.price0CumulativeLast()).to.eq(initialPrice[0].mul(updatedTimestamp2 - blockTimestamp))
    expect(await pair.price1CumulativeLast()).to.eq(initialPrice[1].mul(updatedTimestamp2 - blockTimestamp))

    await mineBlock(blockTimestamp + 20)
    await pair.sync()

    const newPrice = encodePrice(expandTo18Decimals(6), expandTo18Decimals(2))
    expect(await pair.price0CumulativeLast()).to.eq(
      initialPrice[0].mul(updatedTimestamp2 - blockTimestamp).add(newPrice[0].mul(10))
    )
    expect(await pair.price1CumulativeLast()).to.eq(
      initialPrice[1].mul(updatedTimestamp2 - blockTimestamp).add(newPrice[1].mul(10))
    )
  })

  it('feeTo', async () => {
    const daiAmount = expandTo18Decimals(1000)
    const wethAmount = expandTo18Decimals(1000)
    await addLiquidity(daiAmount, wethAmount)

    const swapAmount = expandTo18Decimals(1)
    const expectedOutputAmount = BigNumber.from('996006981039903216')
    await weth.transfer(pair.address, swapAmount)
    await pair.swap(expectedOutputAmount, 0, wallet.address, '0x')

    const expectedLiquidity = expandTo18Decimals(1000)
    await pair.transfer(pair.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
    await pair.burn(wallet.address)
    expect(await pair.totalSupply()).to.eq(MINIMUM_LIQUIDITY.add('249750499251388'))
    expect(await pair.balanceOf(feeManager.address)).to.eq('249750499251388')

    // using 1000 here instead of the symbolic MINIMUM_LIQUIDITY because the amounts only happen to be equal...
    // ...because the initial liquidity amounts were equal

    expect((await dai.balanceOf(pair.address)).add(await pair.farming(dai.address))).to.eq(
      BigNumber.from(1000).add('249501683697445')
    )
    expect((await weth.balanceOf(pair.address)).add(await pair.farming(weth.address))).to.eq(
      BigNumber.from(1000).add('250000187312969')
    )
  })
})
