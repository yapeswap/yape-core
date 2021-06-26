import { ethers } from "hardhat";
import chai, { expect } from 'chai'
import { Contract, Signer, constants, BigNumber } from 'ethers'
import { solidity } from 'ethereum-waffle'

import { expandTo18Decimals, getApprovalDigest, getDomainSeparator } from '../shared/utilities'

chai.use(solidity)

const { hexlify, keccak256, defaultAbiCoder, toUtf8Bytes } = ethers.utils
const { MaxUint256 } = constants

const TOTAL_SUPPLY = expandTo18Decimals(10000)
const TEST_AMOUNT = expandTo18Decimals(10)

describe('UniswapV2ERC20', async () => {
  let wallet: Signer, other: Signer
  let walletAddress
  let otherAddress

  let token: Contract
  let chainId: number
  beforeEach(async () => {
    [wallet, other] = await ethers.getSigners()
    walletAddress = await wallet.getAddress()
    otherAddress = await other.getAddress()
    const ERC20 = await (await ethers.getContractFactory('ERC20')).connect(wallet)
    token = await ERC20.deploy(TOTAL_SUPPLY)
    const network = await wallet.provider.getNetwork()
    chainId = network.chainId
  })

  it('name, symbol, decimals, totalSupply, balanceOf, DOMAIN_SEPARATOR, PERMIT_TYPEHASH', async () => {
    const name = await token.name()
    expect(name).to.eq('Uniswap V2')
    expect(await token.symbol()).to.eq('UNI-V2')
    expect(await token.decimals()).to.eq(18)
    expect(await token.totalSupply()).to.eq(TOTAL_SUPPLY)
    expect(await token.balanceOf(walletAddress)).to.eq(TOTAL_SUPPLY)
    expect(await token.DOMAIN_SEPARATOR()).to.eq(getDomainSeparator(name, token.address, chainId))
    expect(await token.PERMIT_TYPEHASH()).to.eq(
      keccak256(toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)'))
    )
  })

  it('approve', async () => {
    await expect(token.approve(otherAddress, TEST_AMOUNT))
      .to.emit(token, 'Approval')
      .withArgs(walletAddress, otherAddress, TEST_AMOUNT)
    expect(await token.allowance(walletAddress, otherAddress)).to.eq(TEST_AMOUNT)
  })

  it('transfer', async () => {
    await expect(token.transfer(otherAddress, TEST_AMOUNT))
      .to.emit(token, 'Transfer')
      .withArgs(walletAddress, otherAddress, TEST_AMOUNT)
    expect(await token.balanceOf(walletAddress)).to.eq(TOTAL_SUPPLY.sub(TEST_AMOUNT))
    expect(await token.balanceOf(otherAddress)).to.eq(TEST_AMOUNT)
  })

  it('transfer:fail', async () => {
    await expect(token.transfer(otherAddress, TOTAL_SUPPLY.add(1))).to.be.reverted // ds-math-sub-underflow
    await expect(token.connect(other).transfer(walletAddress, 1)).to.be.reverted // ds-math-sub-underflow
  })

  it('transferFrom', async () => {
    await token.approve(otherAddress, TEST_AMOUNT)
    await expect(token.connect(other).transferFrom(walletAddress, otherAddress, TEST_AMOUNT))
      .to.emit(token, 'Transfer')
      .withArgs(walletAddress, otherAddress, TEST_AMOUNT)
    expect(await token.allowance(walletAddress, otherAddress)).to.eq(0)
    expect(await token.balanceOf(walletAddress)).to.eq(TOTAL_SUPPLY.sub(TEST_AMOUNT))
    expect(await token.balanceOf(otherAddress)).to.eq(TEST_AMOUNT)
  })

  it('transferFrom:max', async () => {
    await token.approve(otherAddress, MaxUint256)
    await expect(token.connect(other).transferFrom(walletAddress, otherAddress, TEST_AMOUNT))
      .to.emit(token, 'Transfer')
      .withArgs(walletAddress, otherAddress, TEST_AMOUNT)
    expect(await token.allowance(walletAddress, otherAddress)).to.eq(MaxUint256)
    expect(await token.balanceOf(walletAddress)).to.eq(TOTAL_SUPPLY.sub(TEST_AMOUNT))
    expect(await token.balanceOf(otherAddress)).to.eq(TEST_AMOUNT)
  })

  it.skip('permit', async () => {
    const nonce = await token.nonces(walletAddress)
    const deadline = MaxUint256
    const digest = await getApprovalDigest(
      token,
      { owner: walletAddress, spender: otherAddress, value: TEST_AMOUNT },
      nonce,
      deadline,
      chainId
    )
    const sig = await wallet.signMessage(ethers.utils.arrayify(digest))
    const { v, r, s } = ethers.utils.splitSignature(sig)
    await expect(token.permit(walletAddress, otherAddress, TEST_AMOUNT, deadline, v, r, s))
      .to.emit(token, 'Approval')
      .withArgs(walletAddress, otherAddress, TEST_AMOUNT)
    expect(await token.allowance(walletAddress, otherAddress)).to.eq(TEST_AMOUNT)
    expect(await token.nonces(walletAddress)).to.eq(BigNumber.from(1))
  })
})
