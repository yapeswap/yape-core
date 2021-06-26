/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { YapePair, YapePairInterface } from "../YapePair";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0In",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1In",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve0",
        type: "uint112",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve1",
        type: "uint112",
      },
    ],
    name: "Sync",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINIMUM_LIQUIDITY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "_reserve0",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "_reserve1",
        type: "uint112",
      },
      {
        internalType: "uint32",
        name: "_blockTimestampLast",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "kLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "price0CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price1CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "skim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sync",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526001600c5534801561001557600080fd5b50604080518082018252600a8152692ab734b9bbb0b8102b1960b11b6020918201528151808301835260018152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818301527fbfcc8ef98ffbf7b6c3fec7bf5185b566b9863e35a9d83acd49ad6824b5969738818401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a0808301919091528351808303909101815260c09091019092528151910120600355600580546001600160a01b0319163317905561287c806101086000396000f3fe608060405234801561001057600080fd5b50600436106101b95760003560e01c80636a627842116100f9578063ba9a7a5611610097578063d21220a711610071578063d21220a71461049b578063d505accf146104bb578063dd62ed3e146104ce578063fff6cae9146104f957600080fd5b8063ba9a7a561461045f578063bc25cf7714610468578063c45a01551461047b57600080fd5b80637ecebe00116100d35780637ecebe00146103c857806389afcb44146103e857806395d89b4114610410578063a9059cbb1461044c57600080fd5b80636a6278421461038c57806370a082311461039f5780637464fc3d146103bf57600080fd5b806323b872dd116101665780633644e515116101405780633644e5151461035e578063485cc955146103675780635909c0d51461037a5780635a3d54931461038357600080fd5b806323b872dd1461030a57806330adf81f1461031d578063313ce5671461034457600080fd5b8063095ea7b311610197578063095ea7b31461028b5780630dfe1681146102ae57806318160ddd146102f357600080fd5b8063022c0d9f146101be57806306fdde03146101d35780630902f1ac14610225575b600080fd5b6101d16101cc3660046124a7565b610501565b005b61020f6040518060400160405280600a81526020017f556e69737761702056320000000000000000000000000000000000000000000081525081565b60405161021c91906125d1565b60405180910390f35b600854604080516dffffffffffffffffffffffffffff80841682526e01000000000000000000000000000084041660208201527c010000000000000000000000000000000000000000000000000000000090920463ffffffff169082015260600161021c565b61029e610299366004612440565b610b52565b604051901515815260200161021c565b6006546102ce9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161021c565b6102fc60005481565b60405190815260200161021c565b61029e610318366004612388565b610b69565b6102fc7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b61034c601281565b60405160ff909116815260200161021c565b6102fc60035481565b6101d161037536600461234f565b610c42565b6102fc60095481565b6102fc600a5481565b6102fc61039a366004612315565b610d16565b6102fc6103ad366004612315565b60016020526000908152604090205481565b6102fc600b5481565b6102fc6103d6366004612315565b60046020526000908152604090205481565b6103fb6103f6366004612315565b611007565b6040805192835260208301919091520161021c565b61020f6040518060400160405280600681526020017f554e492d5632000000000000000000000000000000000000000000000000000081525081565b61029e61045a366004612440565b6112b5565b6102fc6103e881565b6101d1610476366004612315565b6112c2565b6005546102ce9073ffffffffffffffffffffffffffffffffffffffff1681565b6007546102ce9073ffffffffffffffffffffffffffffffffffffffff1681565b6101d16104c93660046123c9565b6113c7565b6102fc6104dc36600461234f565b600260209081526000928352604080842090915290825290205481565b6101d16116b2565b600c54600114610572576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f556e697377617056323a204c4f434b454400000000000000000000000000000060448201526064015b60405180910390fd5b6000600c55841515806105855750600084115b610611576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f556e697377617056323a20494e53554646494349454e545f4f55545055545f4160448201527f4d4f554e540000000000000000000000000000000000000000000000000000006064820152608401610569565b60008061066d6008546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b5091509150816dffffffffffffffffffffffffffff16871080156106a05750806dffffffffffffffffffffffffffff1686105b61072c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f556e697377617056323a20494e53554646494349454e545f4c4951554944495460448201527f59000000000000000000000000000000000000000000000000000000000000006064820152608401610569565b600654600754600091829173ffffffffffffffffffffffffffffffffffffffff91821691908116908916821480159061079157508073ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff1614155b6107f7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f556e697377617056323a20494e56414c49445f544f00000000000000000000006044820152606401610569565b8a1561080857610808828a8d6117a0565b891561081957610819818a8c6117a0565b86156108ac576040517f10d1e85c00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8a16906310d1e85c906108799033908f908f908e908e90600401612559565b600060405180830381600087803b15801561089357600080fd5b505af11580156108a7573d6000803e3d6000fd5b505050505b6108b582611940565b93506108c081611940565b92505050600089856dffffffffffffffffffffffffffff166108e2919061270a565b83116108ef576000610913565b6109098a6dffffffffffffffffffffffffffff871661270a565b610913908461270a565b905060006109318a6dffffffffffffffffffffffffffff871661270a565b831161093e576000610962565b6109588a6dffffffffffffffffffffffffffff871661270a565b610962908461270a565b905060008211806109735750600081115b6109fe576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f556e697377617056323a20494e53554646494349454e545f494e5055545f414d60448201527f4f554e54000000000000000000000000000000000000000000000000000000006064820152608401610569565b6000610a20610a0e8460036119e0565b610a1a876103e86119e0565b90611a6a565b90506000610a32610a0e8460036119e0565b9050610a5e620f4240610a586dffffffffffffffffffffffffffff8b8116908b166119e0565b906119e0565b610a6883836119e0565b1015610ad0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f556e697377617056323a204b00000000000000000000000000000000000000006044820152606401610569565b5050610ade84848888611ae2565b60408051838152602081018390529081018c9052606081018b905273ffffffffffffffffffffffffffffffffffffffff8a169033907fd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d8229060800160405180910390a350506001600c55505050505050505050565b6000610b5f338484611dbe565b5060015b92915050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526002602090815260408083203384529091528120547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14610c2d5773ffffffffffffffffffffffffffffffffffffffff84166000908152600260209081526040808320338452909152902054610bfb9083611a6a565b73ffffffffffffffffffffffffffffffffffffffff851660009081526002602090815260408083203384529091529020555b610c38848484611e2d565b5060019392505050565b60055473ffffffffffffffffffffffffffffffffffffffff163314610cc3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f556e697377617056323a20464f5242494444454e0000000000000000000000006044820152606401610569565b6006805473ffffffffffffffffffffffffffffffffffffffff9384167fffffffffffffffffffffffff00000000000000000000000000000000000000009182161790915560078054929093169116179055565b6000600c54600114610d84576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f556e697377617056323a204c4f434b45440000000000000000000000000000006044820152606401610569565b6000600c8190556008546006546dffffffffffffffffffffffffffff808316936e010000000000000000000000000000909304169190610dd99073ffffffffffffffffffffffffffffffffffffffff16611940565b600754909150600090610e019073ffffffffffffffffffffffffffffffffffffffff16611940565b90506000610e1f836dffffffffffffffffffffffffffff8716611a6a565b90506000610e3d836dffffffffffffffffffffffffffff8716611a6a565b90506000610e4b8787611efa565b60005490915080610e8257610e6e6103e8610a1a610e6987876119e0565b612074565b9850610e7d60006103e86120e4565b610ed7565b610ed46dffffffffffffffffffffffffffff8916610ea086846119e0565b610eaa9190612675565b6dffffffffffffffffffffffffffff8916610ec586856119e0565b610ecf9190612675565b61218d565b98505b60008911610f67576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f556e697377617056323a20494e53554646494349454e545f4c4951554944495460448201527f595f4d494e5445440000000000000000000000000000000000000000000000006064820152608401610569565b610f718a8a6120e4565b610f7d86868a8a611ae2565b8115610fb957600854610fb5906dffffffffffffffffffffffffffff808216916e0100000000000000000000000000009004166119e0565b600b555b604080518581526020810185905233917f4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f910160405180910390a250506001600c5550949695505050505050565b600080600c54600114611076576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f556e697377617056323a204c4f434b45440000000000000000000000000000006044820152606401610569565b6000600c8190556008546006546007546dffffffffffffffffffffffffffff808416946e010000000000000000000000000000909404169273ffffffffffffffffffffffffffffffffffffffff92831692909116906110d483611940565b905060006110e183611940565b306000908152600160205260408120549192506110fe8888611efa565b6000549091508061110f84876119e0565b6111199190612675565b9a508061112684866119e0565b6111309190612675565b995060008b118015611142575060008a115b6111ce576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f556e697377617056323a20494e53554646494349454e545f4c4951554944495460448201527f595f4255524e45440000000000000000000000000000000000000000000000006064820152608401610569565b6111d830846121a5565b6111e3878d8d6117a0565b6111ee868d8c6117a0565b6111f787611940565b945061120286611940565b935061121085858b8b611ae2565b811561124c57600854611248906dffffffffffffffffffffffffffff808216916e0100000000000000000000000000009004166119e0565b600b555b604080518c8152602081018c905273ffffffffffffffffffffffffffffffffffffffff8e169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496910160405180910390a35050505050505050506001600c81905550915091565b6000610b5f338484611e2d565b600c5460011461132e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f556e697377617056323a204c4f434b45440000000000000000000000000000006044820152606401610569565b6000600c5560065460075460085473ffffffffffffffffffffffffffffffffffffffff9283169290911690611383908390859061137e906dffffffffffffffffffffffffffff16610a1a84611940565b6117a0565b6008546113bd908290859061137e906e01000000000000000000000000000090046dffffffffffffffffffffffffffff16610a1a84611940565b50506001600c5550565b42841015611431576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f556e697377617056323a204558504952454400000000000000000000000000006044820152606401610569565b60035473ffffffffffffffffffffffffffffffffffffffff8816600090815260046020526040812080549192917f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918b918b918b91908761149183612776565b9091555060408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810187905260e001604051602081830303815290604052805190602001206040516020016115329291907f190100000000000000000000000000000000000000000000000000000000000081526002810192909252602282015260420190565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff88169284019290925260608301869052608083018590529092509060019060a0016020604051602081039080840390855afa1580156115bb573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff81161580159061163657508873ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b61169c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f556e697377617056323a20494e56414c49445f5349474e4154555245000000006044820152606401610569565b6116a7898989611dbe565b505050505050505050565b600c5460011461171e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f556e697377617056323a204c4f434b45440000000000000000000000000000006044820152606401610569565b6000600c55600654611799906117499073ffffffffffffffffffffffffffffffffffffffff16611940565b60075461176b9073ffffffffffffffffffffffffffffffffffffffff16611940565b6008546dffffffffffffffffffffffffffff808216916e010000000000000000000000000000900416611ae2565b6001600c55565b604080518082018252601981527f7472616e7366657228616464726573732c75696e743235362900000000000000602091820152815173ffffffffffffffffffffffffffffffffffffffff85811660248301526044808301869052845180840390910181526064909201845291810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb0000000000000000000000000000000000000000000000000000000017905291516000928392871691611867919061253d565b6000604051808303816000865af19150503d80600081146118a4576040519150601f19603f3d011682016040523d82523d6000602084013e6118a9565b606091505b50915091508180156118d35750805115806118d35750808060200190518101906118d3919061246c565b611939576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f556e697377617056323a205452414e534645525f4641494c45440000000000006044820152606401610569565b5050505050565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009073ffffffffffffffffffffffffffffffffffffffff8316906370a082319060240160206040518083038186803b1580156119a857600080fd5b505afa1580156119bc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b63919061248e565b6000811580611a04575082826119f681836126cd565b9250611a029083612675565b145b610b63576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f64732d6d6174682d6d756c2d6f766572666c6f770000000000000000000000006044820152606401610569565b600082611a77838261270a565b9150811115610b63576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f64732d6d6174682d7375622d756e646572666c6f7700000000000000000000006044820152606401610569565b6dffffffffffffffffffffffffffff8411801590611b0e57506dffffffffffffffffffffffffffff8311155b611b74576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f556e697377617056323a204f564552464c4f57000000000000000000000000006044820152606401610569565b6000611b85640100000000426127af565b600854909150600090611bbe907c0100000000000000000000000000000000000000000000000000000000900463ffffffff1683612721565b905060008163ffffffff16118015611be557506dffffffffffffffffffffffffffff841615155b8015611c0057506dffffffffffffffffffffffffffff831615155b15611cce578063ffffffff16611c3d85611c1986612256565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1690612281565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff16611c6591906126cd565b60096000828254611c769190612622565b909155505063ffffffff8116611c8f84611c1987612256565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff16611cb791906126cd565b600a6000828254611cc89190612622565b90915550505b6008805463ffffffff84167c0100000000000000000000000000000000000000000000000000000000027bffffffffffffffffffffffffffffffffffffffffffffffffffffffff6dffffffffffffffffffffffffffff8981166e0100000000000000000000000000009081027fffffffff000000000000000000000000000000000000000000000000000000009095168c83161794909417918216831794859055604080519382169282169290921783529290930490911660208201527f1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1910160405180910390a1505050505050565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526002602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260016020526040902054611e5d9082611a6a565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152600160205260408082209390935590841681522054611e99908261229d565b73ffffffffffffffffffffffffffffffffffffffff80841660008181526001602052604090819020939093559151908516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90611e209085815260200190565b600080600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663017e7e586040518163ffffffff1660e01b815260040160206040518083038186803b158015611f6557600080fd5b505afa158015611f79573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611f9d9190612332565b600b5473ffffffffffffffffffffffffffffffffffffffff821615801594509192509061206057801561205b576000611fec610e696dffffffffffffffffffffffffffff8881169088166119e0565b90506000611ff983612074565b90508082111561205857600061201b6120128484611a6a565b600054906119e0565b905060006120348361202e8660056119e0565b9061229d565b905060006120428284612675565b905080156120545761205487826120e4565b5050505b50505b61206c565b801561206c576000600b555b505092915050565b600060038211156120d5575080600061208e600283612675565b612099906001612622565b90505b818110156120cf579050806002816120b48186612675565b6120be9190612622565b6120c89190612675565b905061209c565b50919050565b81156120df575060015b919050565b6000546120f1908261229d565b600090815573ffffffffffffffffffffffffffffffffffffffff8316815260016020526040902054612123908261229d565b73ffffffffffffffffffffffffffffffffffffffff83166000818152600160205260408082209390935591519091907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906121819085815260200190565b60405180910390a35050565b600081831061219c578161219e565b825b9392505050565b73ffffffffffffffffffffffffffffffffffffffff82166000908152600160205260409020546121d59082611a6a565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260016020526040812091909155546122099082611a6a565b600090815560405182815273ffffffffffffffffffffffffffffffffffffffff8416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001612181565b6000610b636e0100000000000000000000000000006dffffffffffffffffffffffffffff8416612689565b600061219e6dffffffffffffffffffffffffffff83168461263a565b6000826122aa8382612622565b9150811015610b63576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f64732d6d6174682d6164642d6f766572666c6f770000000000000000000000006044820152606401610569565b60006020828403121561232757600080fd5b813561219e81612821565b60006020828403121561234457600080fd5b815161219e81612821565b6000806040838503121561236257600080fd5b823561236d81612821565b9150602083013561237d81612821565b809150509250929050565b60008060006060848603121561239d57600080fd5b83356123a881612821565b925060208401356123b881612821565b929592945050506040919091013590565b600080600080600080600060e0888a0312156123e457600080fd5b87356123ef81612821565b965060208801356123ff81612821565b95506040880135945060608801359350608088013560ff8116811461242357600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561245357600080fd5b823561245e81612821565b946020939093013593505050565b60006020828403121561247e57600080fd5b8151801515811461219e57600080fd5b6000602082840312156124a057600080fd5b5051919050565b6000806000806000608086880312156124bf57600080fd5b853594506020860135935060408601356124d881612821565b9250606086013567ffffffffffffffff808211156124f557600080fd5b818801915088601f83011261250957600080fd5b81358181111561251857600080fd5b89602082850101111561252a57600080fd5b9699959850939650602001949392505050565b6000825161254f818460208701612746565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff8616815284602082015283604082015260806060820152816080820152818360a0830137600081830160a090810191909152601f9092017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0160101949350505050565b60208152600082518060208401526125f0816040850160208701612746565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b60008219821115612635576126356127c3565b500190565b60007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff80841680612669576126696127f2565b92169190910492915050565b600082612684576126846127f2565b500490565b60007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff808316818516818304811182151516156126c4576126c46127c3565b02949350505050565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615612705576127056127c3565b500290565b60008282101561271c5761271c6127c3565b500390565b600063ffffffff8381169083168181101561273e5761273e6127c3565b039392505050565b60005b83811015612761578181015183820152602001612749565b83811115612770576000848401525b50505050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156127a8576127a86127c3565b5060010190565b6000826127be576127be6127f2565b500690565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b73ffffffffffffffffffffffffffffffffffffffff8116811461284357600080fd5b5056fea26469706673582212204902f7c178980d7819777692aea6815f1d40aa7f851116f1ef6e8edb318c4cfd64736f6c63430008060033";

export class YapePair__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<YapePair> {
    return super.deploy(overrides || {}) as Promise<YapePair>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): YapePair {
    return super.attach(address) as YapePair;
  }
  connect(signer: Signer): YapePair__factory {
    return super.connect(signer) as YapePair__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): YapePairInterface {
    return new utils.Interface(_abi) as YapePairInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): YapePair {
    return new Contract(address, _abi, signerOrProvider) as YapePair;
  }
}
