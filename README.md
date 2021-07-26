# Yapeswap

Yearn-ed Uniswap

## Credits

This project is built on a fork of Uniswap V2, the most loved open-source version of AMM.

# Local Development

The following assumes the use of `node@>=10`.

## Install Dependencies

```
$ yarn
```

## Compile Contracts

```
$ yarn compile
```

## Run Tests

1. Go to alchemy api and get an API key
2. Export the API key into the .env variable
   ```
   $ echo "FORK_URL=https://eth-mainnet.alchemyapi.io/v2/<key>" >> .env
   ```
3. Build & test
   ```
   $ yarn build
   $ yarn test
   ```
