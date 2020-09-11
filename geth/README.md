# Using these contracts with Geth

If you are using Geth then you *cannot* fork from a network as you can with Ganache as explained in the root [README](../README.md).

So with a local Geth you can either start up the node and sync with the testnet such as Ropesten using 'light' client mode so that its superfast. However that means that if we want to deploy our own exchanges or interact with the node we are doing so on the Ropesten network.

If we want to test the Uniswap exchange locally as we can using the Ganache fork example we need to first deploy our own copy of the contracts to our local geth. Of course this is the benefit of using a fork in Ganache. However, if you **really need** geth then this is the only way.

### Deploy the Uniswap contracts to your local geth node

This is in a separate repoository as shown below:

Clone the [Uniswap Exchange Setup](https://github.com/devbootstrap/uniswap-exchange-setup) repo. Follow the instructions in the README of that repo to deploy a local Uniswap Excange to your local Geth. This repo deploys the Uniswap Factory and Uniswap Exchange Template as well as a couple of tokens and creates exchanges and adds liquidity to those exchanges. It basically setsup our local Geth with the Uniswap contracts we need and essentialy tests they are working as expected.

### Interact with these contracts

First copy the `.env.example` file so that you have the `GETH_IPC_PATH` set to the location of your `geth.ipc` file.

Now you are ready to start up a truffle session! The truffle-config is already set to point to the geth node by default, so all you need to run is:

```
truffle console
```

Now compile and migrate the ERC20 token contracts `GLDToken`. We will use this token to create a new local Uniswap exchange later.

```
compile
migrate --reset
```

Now its time to create the Uniswap Exchange for your token

```
// Copy and paste this address from the deployments you made over in the Uniswap Exchange Setup repo (see above instructions)
factory_address = '0x3Ef4D8969b3b1b6475eAA139fCe538AF2E4cf00c'

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