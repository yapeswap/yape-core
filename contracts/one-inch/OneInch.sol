//SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma abicoder v2;

library OneInch {
    struct SwapDescription {
        address srcToken;
        address dstToken;
        address srcReceiver;
        address dstReceiver;
        uint256 amount;
        uint256 minReturnAmount;
        uint256 guaranteedAmount;
        uint256 flags;
        address referrer;
        bytes permit;
    }

    struct CallDescription {
        uint256 targetWithMandatory;
        uint256 gasLimit;
        uint256 value;
        bytes data;
    }

    function decode(bytes calldata swapData)
        internal
        pure
        returns (
            uint256 amount,
            address srcToken,
            address dstToken,
            address dstReceiver
        )
    {
        (, SwapDescription memory desc, ) = abi.decode(
            swapData[4:swapData.length - 1],
            (address, SwapDescription, CallDescription[])
        );
        srcToken = desc.srcToken;
        dstToken = desc.dstToken;
        amount = desc.amount;
        dstReceiver = desc.dstReceiver;
    }
}
