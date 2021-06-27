import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expandTo18Decimals } from "./utilities";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

interface FactoryFixture {
  factory: Contract;
}

interface PairFixture extends FactoryFixture {
  token0: Contract;
  token1: Contract;
  pair: Contract;
}


export async function factoryFixture(signer: SignerWithAddress): Promise<FactoryFixture> {
  const YapeFactory = (
    await ethers.getContractFactory("YapeFactory")
  ).connect(signer);
  const factory = await YapeFactory.deploy(signer.address, signer.address);
  return { factory };
}


export async function pairFixture(signer: SignerWithAddress): Promise<PairFixture> {
  const ERC20 = await ethers.getContractFactory("ERC20");
  const fixture = await factoryFixture(signer);
  const tokenA = await ERC20.deploy(expandTo18Decimals(10000));
  const tokenB = await ERC20.deploy(expandTo18Decimals(10000));
  await fixture.factory.createPair(tokenA.address, tokenB.address);
  const pairAddress = await fixture.factory.getPair(
    tokenA.address,
    tokenB.address
  );
  const pair = await ethers.getContractAt("YapePair", pairAddress, signer);
  const token0Address = await pair.token0();
  const token0 = tokenA.address === token0Address ? tokenA : tokenB;
  const token1 = tokenA.address === token0Address ? tokenB : tokenA;
  return { token0, token1, pair, ...fixture };
}
