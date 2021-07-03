import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const DAI_SLOT = 2

const toBytes32 = (bn: BigNumber) => {
  return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32))
}

const setStorageAt = async (address: string, index: string, value: string) => {
  await ethers.provider.send('hardhat_setStorageAt', [address, index, value])
  await ethers.provider.send('evm_mine', []) // Just mines to the next block
}

// https://kndrck.co/posts/local_erc20_bal_mani_w_hh/ Many thanks to @kendricktan
export async function manipulateDai(address: string, amount: number) {
  const locallyManipulatedBalance = parseEther(`${amount}`)

  // Get storage slot index
  const index = ethers.utils.solidityKeccak256(
    ['uint256', 'uint256'],
    [address, DAI_SLOT] // key, slot
  )

  // Manipulate local balance (needs to be bytes32 string)
  await setStorageAt(DAI_ADDRESS, index.toString(), toBytes32(locallyManipulatedBalance).toString())
}
