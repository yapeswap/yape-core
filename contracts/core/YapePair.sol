// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.0;
pragma abicoder v2;

import {UniswapV2Pair} from "../uni-v2/UniswapV2Pair.sol";
import {UQ112x112} from "../uni-v2/libraries/UQ112x112.sol";
import {Math} from "../uni-v2/libraries/Math.sol";
import {SafeMath} from "../uni-v2/libraries/SafeMath.sol";
import {IERC20} from "../uni-v2/interfaces/IERC20.sol";

contract YapePair is UniswapV2Pair {
    using SafeMath for uint256;
    using UQ112x112 for uint224;

    function _balanceOf(address token)
        internal
        view
        override
        returns (uint256)
    {
        return IERC20(token).balanceOf(address(this));
    }

    function _safeTransfer(
        address token,
        address to,
        uint256 value
    ) internal override {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(SELECTOR, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "UniswapV2: TRANSFER_FAILED"
        );
    }
}
