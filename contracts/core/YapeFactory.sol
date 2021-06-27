// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.0;
pragma abicoder v2;

import {IUniswapV2Pair} from "../uni-v2/interfaces/IUniswapV2Pair.sol";
import {UniswapV2Factory} from "../uni-v2/UniswapV2Factory.sol";
import {YapePair} from "./YapePair.sol";
import {IYapePair} from "../interfaces/IYapePair.sol";

contract YapeFactory is UniswapV2Factory {
    address public registry;
    address public operator;

    constructor(address feeToSetter_, address registry_)
        UniswapV2Factory(feeToSetter_)
    {
        registry = registry_;
    }

    function setRegistry(address registry_) external {
        require(msg.sender == feeToSetter, "UniswapV2: FORBIDDEN");
        registry = registry_;
    }

    function createPair(address tokenA, address tokenB)
        external
        override
        returns (address pair)
    {
        require(tokenA != tokenB, "Yapeswap: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "Yapeswap: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "Yapeswap: PAIR_EXISTS"); // single check is sufficient
        bytes memory bytecode = type(YapePair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IYapePair(pair).initialize(token0, token1);
        IYapePair(pair).updateRegistry();
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
}
