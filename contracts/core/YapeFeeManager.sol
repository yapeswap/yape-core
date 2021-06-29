// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.0;
pragma abicoder v2;

import {Governed} from "@workhard/protocol/contracts/core/governance/Governed.sol";
import {IDividendPool} from "@workhard/protocol/contracts/core/dividend/interfaces/IDividendPool.sol";
import {AccessControlEnumerable} from "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {OneInch} from "../one-inch/OneInch.sol";
import {IUniswapV2Pair} from "../uni-v2/interfaces/IUniswapV2Pair.sol";

contract YapeFeeManager is Governed, AccessControlEnumerable {
    using OneInch for bytes;
    using SafeMath for uint256;

    bytes32 public constant FEE_MANAGER_ADMIN_ROLE =
        keccak256("FEE_MANAGER_ADMIN_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    address public dividendPool;
    address public yape;
    address public oneInch;

    constructor(
        address gov_,
        address dividendPool_,
        address yape_,
        address oneInch_
    ) {
        Governed.initialize(gov_);
        dividendPool = dividendPool_;
        yape = yape_;
        oneInch = oneInch_;
        IERC20(yape).approve(dividendPool_, type(uint256).max);
        _setRoleAdmin(FEE_MANAGER_ADMIN_ROLE, FEE_MANAGER_ADMIN_ROLE);
        _setRoleAdmin(EXECUTOR_ROLE, FEE_MANAGER_ADMIN_ROLE);

        // deployer + self administration
        _setupRole(FEE_MANAGER_ADMIN_ROLE, gov_);
        _setupRole(FEE_MANAGER_ADMIN_ROLE, address(this));
    }

    function convert(address pair, uint256 amount)
        public
        onlyRole(EXECUTOR_ROLE)
    {
        IUniswapV2Pair(pair).transferFrom(address(this), pair, amount); // send liquidity to pair
        IUniswapV2Pair(pair).burn(address(this));
    }

    function swapOn1Inch(bytes calldata swapData)
        public
        onlyRole(EXECUTOR_ROLE)
    {
        // Swap to stable coin and transfer them to the commit pool
        (
            uint256 amount,
            address srcToken,
            address dstToken,
            address dstReceiver
        ) = swapData.decode();
        require(
            IERC20(srcToken).balanceOf(address(this)) >= amount,
            "YapeFeeManager: NOT ENOUGH BALANCE"
        );
        require(srcToken != yape, "YapeFeeManager: SPENDING YAPE");
        require(dstToken == yape, "YapeFeeManager: SHOULD BUY YAPE");
        require(dstReceiver == address(this), "YapeFeeManager: INVALID DST");
        uint256 prevBal = IERC20(yape).balanceOf(address(this));
        (bool success, bytes memory result) = oneInch.call(swapData);
        require(success, "failed to swap tokens");
        uint256 swappedAmount;
        assembly {
            swappedAmount := mload(add(result, 0x20))
        }
        require(
            swappedAmount == IERC20(yape).balanceOf(address(this)).sub(prevBal),
            "Swapped amount is different with the real swapped amount"
        );
    }

    function distribute(uint256 amount) public onlyRole(EXECUTOR_ROLE) {
        IDividendPool(dividendPool).distribute(yape, amount);
    }
}
