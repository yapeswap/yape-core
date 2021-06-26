// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >= 0.8.0;
pragma abicoder v2;

import { IUniswapV2Pair } from "../uni-v2/interfaces/IUniswapV2Pair.sol";
import { UniswapV2Factory } from "../uni-v2/UniswapV2Factory.sol";
import { YapeswapPair } from "./YapeswapPair.sol";

contract YapeswapFactory is UniswapV2Factory {
    constructor(address _feeToSetter) UniswapV2Factory(_feeToSetter) {
    }

    function createPair(address tokenA, address tokenB) external override returns (address pair) {
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(YapeswapPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IUniswapV2Pair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
}