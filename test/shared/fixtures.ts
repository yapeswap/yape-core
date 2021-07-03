// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { expandTo18Decimals } from './utilities'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { DAO, Workhard, deployed } from '@workhard/protocol'
import { BigNumberish, Signer } from 'ethers'
import { FeeManager, FeeManager__factory } from '@workhard/utils'
import { parseEther } from 'ethers/lib/utils'

export type ForkParam = {
  multisig: string
  treasury: string
  baseCurrency: string
  projectName: string
  projectSymbol: string
  visionName: string
  visionSymbol: string
  commitName: string
  commitSymbol: string
  rightName: string
  rightSymbol: string
  emissionStartDelay: BigNumberish
  minDelay: BigNumberish
  voteLaunchDelay: BigNumberish
  initialEmission: BigNumberish
  minEmissionRatePerWeek: BigNumberish
  emissionCutRate: BigNumberish
  founderShare: BigNumberish
}

export type LaunchParam = {
  commitMiningWeight: number
  liquidityMiningWeight: number
  treasuryWeight: number
  callerBonus: number
}

interface FactoryFixture {
  factory: Contract
}

interface PairFixture extends FactoryFixture {
  token0: Contract
  token1: Contract
  pair: Contract
}

export async function factoryFixture(signer: SignerWithAddress): Promise<FactoryFixture> {
  const YapeFactory = (await ethers.getContractFactory('YapeFactory')).connect(signer)
  const YapePairCode = (await ethers.getContractFactory('YapePairCode')).connect(signer)
  const pairCode = await YapePairCode.deploy()
  const factory = await YapeFactory.deploy(signer.address, MAINNET_YEARN_V2_REGISTRY, signer.address, pairCode.address)
  return { factory }
}

export async function pairFixture(signer: SignerWithAddress): Promise<PairFixture> {
  const ERC20 = await ethers.getContractFactory('ERC20')
  const fixture = await factoryFixture(signer)
  const tokenA = await ERC20.deploy(expandTo18Decimals(10000))
  const tokenB = await ERC20.deploy(expandTo18Decimals(10000))
  await fixture.factory.createPair(tokenA.address, tokenB.address)
  const pairAddress = await fixture.factory.getPair(tokenA.address, tokenB.address)
  const pair = await ethers.getContractAt('YapePair', pairAddress, signer)
  const token0Address = await pair.token0()
  const token0 = tokenA.address === token0Address ? tokenA : tokenB
  const token1 = tokenA.address === token0Address ? tokenB : tokenA
  return { token0, token1, pair, ...fixture }
}

interface WHFFixtures {
  daoId: number
  forkedDAO: DAO
  workhard: Workhard
  feeManager: FeeManager
}

export const MAINNET_DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
export const MAINNET_WEHT9 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
export const MAINNET_YEARN_V2_REGISTRY = `0x50c1a2ea0a861a967d9d0ffe2ae4012c2e053804`

export async function whfFixtures({
  signer,
  daoId,
}: {
  signer: SignerWithAddress
  daoId?: number
}): Promise<WHFFixtures> {
  const workhard = await Workhard.from(ethers.provider, deployed.mainnet.Project)
  const project = workhard.project.connect(signer)

  const param = {
    forkParam: {
      multisig: signer.address,
      treasury: signer.address,
      baseCurrency: MAINNET_DAI, // todo update to dai
      projectName: 'Workhard Forked Dev',
      projectSymbol: 'WFK',
      visionName: 'Flovoured Vision',
      visionSymbol: 'fVISION',
      commitName: 'Flavoured Commit',
      commitSymbol: 'fCOMMIT',
      rightName: 'Flavoured Right',
      rightSymbol: 'fRIGHT',
      emissionStartDelay: 86399 * 7,
      minDelay: 86399,
      voteLaunchDelay: 86399 * 7 * 4,
      initialEmission: parseEther('23999999'),
      minEmissionRatePerWeek: 59,
      emissionCutRate: 2999,
      founderShare: 499,
    },
    launchParam: {
      commitMiningWeight: 4749,
      liquidityMiningWeight: 4749,
      treasuryWeight: 498,
      callerBonus: 0,
    },
  }
  let forkedDAOId: number
  if (daoId) {
    forkedDAOId = daoId
  } else if (param) {
    await project.createProject(0, 'mockuri')
    const projId = await project.projectsOfDAOByIndex(0, (await project.projectsOf(0)).sub(1))
    await project.upgradeToDAO(projId, param.forkParam)
    await project.launch(
      projId,
      param.launchParam.liquidityMiningWeight,
      param.launchParam.commitMiningWeight,
      param.launchParam.treasuryWeight,
      param.launchParam.callerBonus
    )
    forkedDAOId = projId.toNumber()
  }
  const forkedDAO = await workhard.getDAO(forkedDAOId)

  const feeManager = await new FeeManager__factory(signer).deploy(
    forkedDAO.timelock.address,
    forkedDAO.dividendPool.address,
    MAINNET_DAI,
    MAINNET_WEHT9
  )
  return {
    daoId: forkedDAOId,
    forkedDAO,
    workhard,
    feeManager,
  }
}
