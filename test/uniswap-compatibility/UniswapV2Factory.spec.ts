import chai, { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, constants, BigNumber, Signer } from "ethers";
import { solidity } from "ethereum-waffle";

import { expandTo18Decimals, getCreate2Address } from "../shared/utilities";
import { factoryFixture } from "../shared/fixtures";

chai.use(solidity);

const { AddressZero } = constants;

const provider = ethers.provider;

describe("Uniswap compatibility: YapeFactory", async () => {
  let wallet: Signer, other: Signer;
  let walletAddress: string;
  let otherAddress: string;
  let factory: Contract;
  let undarkener: Contract;
  let hRatioHash: Contract;
  let TEST_ADDRESSES: [string, string];
  beforeEach(async () => {
    [wallet, other] = await ethers.getSigners();
    walletAddress = await wallet.getAddress();
    otherAddress = await other.getAddress();
    const fixture = await factoryFixture(wallet);
    const ERC20Tester = await ethers.getContractFactory("ERC20");
    const tokenA = await ERC20Tester.deploy(expandTo18Decimals(10000));
    const tokenB = await ERC20Tester.deploy(expandTo18Decimals(10000));
    factory = fixture.factory;
    undarkener = fixture.factory;
    hRatioHash = fixture.factory;
    TEST_ADDRESSES = [tokenA.address, tokenB.address].sort() as [
      string,
      string
    ];
  });

  it("feeTo, feeToSetter, allPairsLength", async () => {
    expect(await factory.feeTo()).to.eq(AddressZero);
    expect(await factory.feeToSetter()).to.eq(walletAddress);
    expect(await factory.allPairsLength()).to.eq(0);
  });

  async function createPair(tokens: [string, string]) {
    const YapePair = await ethers.getContractFactory("YapePair");
    const create2Address = getCreate2Address(
      factory.address,
      tokens,
      `${YapePair.bytecode}`
    );
    await expect(factory.createPair(...tokens))
      .to.emit(factory, "PairCreated")
      .withArgs(
        TEST_ADDRESSES[0],
        TEST_ADDRESSES[1],
        create2Address,
        BigNumber.from(1)
      );

    await expect(factory.createPair(...tokens)).to.be.reverted; // UnsiwapV2: PAIR_EXISTS
    await expect(factory.createPair(...tokens.slice().reverse())).to.be
      .reverted; // UnsiwapV2: PAIR_EXISTS
    expect(await factory.getPair(...tokens)).to.eq(create2Address);
    expect(await factory.getPair(...tokens.slice().reverse())).to.eq(
      create2Address
    );
    expect(await factory.allPairs(0)).to.eq(create2Address);
    expect(await factory.allPairsLength()).to.eq(1);
    const pair = new Contract(
      create2Address,
      YapePair.interface,
      provider
    );
    expect(await pair.factory()).to.eq(factory.address);
    expect(await pair.token0()).to.eq(TEST_ADDRESSES[0]);
    expect(await pair.token1()).to.eq(TEST_ADDRESSES[1]);
  }

  it("createPair", async () => {
    await createPair(TEST_ADDRESSES);
  });

  it("createPair:reverse", async () => {
    await createPair(TEST_ADDRESSES.slice().reverse() as [string, string]);
  });

  it("createPair:gas", async () => {
    const tx = await factory.createPair(...TEST_ADDRESSES);
    const receipt = await tx.wait();
    expect(receipt.gasUsed).to.eq(2624998);
  });

  it("setFeeTo", async () => {
    await expect(
      factory.connect(other).setFeeTo(otherAddress)
    ).to.be.revertedWith("UniswapV2: FORBIDDEN");
    await factory.setFeeTo(walletAddress);
    expect(await factory.feeTo()).to.eq(walletAddress);
  });

  it("setFeeToSetter", async () => {
    await expect(
      factory.connect(other).setFeeToSetter(otherAddress)
    ).to.be.revertedWith("UniswapV2: FORBIDDEN");
    await factory.setFeeToSetter(otherAddress);
    expect(await factory.feeToSetter()).to.eq(otherAddress);
    await expect(factory.setFeeToSetter(walletAddress)).to.be.revertedWith(
      "UniswapV2: FORBIDDEN"
    );
  });
});
