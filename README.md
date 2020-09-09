# Uniswap Exchange Fork

Repo shows forking ganache to interact with deployed Uniswap contracts as if they were local. New exchanges, tokens and so on that are created during the truffle terminal session remain local.

This experiment was contuctted using [Uniswap V1](https://uniswap.org/docs/v1)

## Start Ganache as a fork from Rinkeby

Ganache can be started as a fork from another network. Using Infura this can easily be set to mainnet or any of the testnets.

Run the command below to start a local ganche blockchain that is forked from rinkeby. Replace `<YOUR_INFURA_PROJECT_ID>` with your value and replace `<BLOCK_NUMBER_TO_FORK_FROM>` with the [blocknumber](https://rinkeby.etherscan.io/tx/0x24eac955e39f96d5abc2b42cdd2bdcef193ecc4718469d856ca6bb9906330a47) of your choice.

```
ganache-cli --fork https://rinkeby.infura.io/v3/<YOUR_INFURA_PROJECT_ID>@<BLOCK_NUMBER_TO_FORK_FROM>
```

## Interact with the contracts in Truffle Console

Start up a truffle console like so. This will connect to the running local ganache blockchain that is already forked from rinkeby.

```
truffle console --network rinkebylocal
```

In our truffle project we have our own ERC-20 token (GLDToken) that we want to test out using Uniswap. However, for now we want to keep everything under a local development environment while still being able to interact with the Smart Contracts on the live (Rinkey) network.

The way I have done this is to copy in the [Uniswap V1 Interfaces](https://uniswap.org/docs/v1/smart-contracts/interfaces/) into the `contracts` directory of this project and then created contracts from these interfaces that can be used as a *wrapper* to load the deployed instances of the contracts from the forked network deployed addresses.

NOTE: I comment out the declared variables in the interface otherwise there is compile error.

Now try the following in the console window.

```
compile

migrate --reset

// https://uniswap.org/docs/v1/frontend-integration/connect-to-uniswap/
factory_address = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36'

// Initialize a UniswapFactory instance from the deployed address (on Rinkeby)
const factoryInstance = await UniswapFactory.at(factory_address)

// Deploy UniswapExchange for GLD Token
await factoryInstance.createExchange(GLDToken.address)

// Get the deployed instance of our GLD Token
const gldToken = await GLDToken.deployed()

// Get the GLD Token Exchange address
const gldTokenExchangeAddress = await factoryInstance.getExchange(GLDToken.address)

// Approve GLDToken UniswapExchange contract to transfer GLDToken
await gldToken.approve(gldTokenExchangeAddress, 10000)

// Get the GLD Token Exchange instance
const gldTokenExchangeInstance = await UniswapExchange.at(gldTokenExchangeAddress)

// Set liquidity parameters
const minLiquidity = 0

const maxTokens = 500

const deadline = Math.floor(Date.now() / 1000) + 300

// Add liquidity to the exchange
await gldTokenExchangeInstance.addLiquidity(minLiquidity, maxTokens, deadline, { value: 5000000000000000000 })
```

### Mainnet Uniswap Exchange

https://etherscan.io/address/0xc0a47dfe034b400b47bdad5fecda2621de6c4d95#events