import assert from "assert";
import { BigNumber } from "ethers";

export const getAmountOut = (amountIn: BigNumber, reserveIn: BigNumber, reserveOut: BigNumber) => {
  assert(amountIn.gt(0), 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT')
  assert(reserveIn.gt(0) && reserveOut.gt(0), 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
  const amountInWithFee = amountIn.mul(997);
  const numerator = amountInWithFee.mul(reserveOut);
  const denominator = reserveIn.mul(1000).add(amountInWithFee);
  const amountOut = numerator.div(denominator);
  return amountOut
}

export const getAmountIn = (amountOut: BigNumber, reserveIn: BigNumber, reserveOut: BigNumber) => {
  assert(amountOut.gt(0), 'UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');
  assert(reserveIn.gt(0) && reserveOut.gt(0), 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
  const numerator = reserveIn.mul(amountOut).mul(1000);
  const denominator = reserveOut.sub(amountOut).mul(997);
  const amountIn = (numerator.div(denominator)).add(1);
}
