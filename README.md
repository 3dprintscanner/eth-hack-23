# Eth London Hackathon 2023

This contains contracts, frontend code and the presentation for the BetSquared submission for Eth London Hackathon 2023


## Code


### Front end

Built as a React App:
Requires node js, yarn, npm.

To run first clone this repository

`cd frontend`

`yarn`

`npm run start`


### Back End

This is a modified contract of the RrpRequester.sol file to add additional functions for placing bets and cashing out.

The basic logic is that bettors can place bets on a particular winner of a racing championship and the contract can be completed by calling the collectWinnings() function, this calculates the winner of the racing championship based on the result of calling the API3 Sports Oracle.
Sucessfull bettors are then issued tokens for their win.

Refer to `contracts\RrpRequester.sol` and deploy as per the API3 test backend contracts [here](https://github.com/api3-ecosystem/getting-started)

This contract is deployed to `xC655E33540F43B854ac80B9Ac403ed39F63d71a8` on the Goerli Testnet, the Sponsor wallet is deployed to `0x1afB6039ff1DA423E58AE30E75aCFFACDA92cb84` on the Goerli Testnet.

This contract has been paid into and successfully minted bet win tokens to my MetaMask wallet at `0x1412606EDD32aDcf938F6A4096594698da7f7Fc0` on the Goerli Testnet, you can verify the presence of BTSQ tokens.

See [EtherScan](https://goerli.etherscan.io/address/0x1412606EDD32aDcf938F6A4096594698da7f7Fc0#tokentxns) for proof of token minting.



## Presentation

Refer to the presentation  [here](/presentation/presentation.pdf) for more details on this project, future development and the intent of the rough prototype built above.

