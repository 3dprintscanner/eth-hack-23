import React, { useState, useEffect } from 'react';

import { AppBar, Toolbar, Typography, Button, CssBaseline, ThemeProvider, Card, Paper, TextField, Select, MenuItem } from '@mui/material';

import Web3 from 'web3';

import theme from './theme';
import ContractABI from './RrpRequester.json';


const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [/* Your contract's ABI here */];
const sponsor = "0xC655E33540F43B854ac80B9Ac403ed39F63d71a8"

function Web3Example() {
  const [web3, setWeb3] = useState(null);
  const [ from, setFrom ] = useState(null);
  const [account, setAccount] = useState('N/A');

  const [selectedValue, setSelectedValue] = useState(1);
  const [contract, setContract] = useState(null);
  const [cashoutContract, setCashoutContract] = useState(null);

  const [result, setResult] = useState('N/A');

  const [wagerAmount, setWagerAmount] = useState(0.001);

  const handleWagerAmountChange = (e) => {
    console.log("Wager amount", e.target.value)
    setWagerAmount(e.target.value);
  };

  const handleSelectedValueChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const initializeWeb3 = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setFrom(result[0])
        return web3;
      } catch (error) {
        throw new Error('Access denied to MetaMask');
      }
    } else {
      throw new Error('MetaMask is not installed');
    }
  };

    async function connectToMetaMask() {
        if (window.ethereum) {
            try {
                var thisWeb3 = new Web3(window.ethereum);
                setWeb3(thisWeb3);
                await window.ethereum.enable();
                const accounts = await thisWeb3.eth.getAccounts();
                const account = accounts[0];
                console.log(`Account: ${account}`);
                // contract = new web3.eth.Contract(contractABI, contractAddress);
                setContract(true);
                // callButton.disabled = false;
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("no metamasko");
            // accountDisplay.textContent = 'MetaMask not detected';
        }
    }

    useEffect(() => {
        const init = async () => {
          try {
            const web3Instance = await initializeWeb3();
            setWeb3(web3Instance);
            setContract(true);
          } catch (error) {
            console.error(error.message);
          }
        };
        init();
      }, []);

  

  async function callContractFunction() {
    // ... (No changes in the function)

    const contract = new web3.eth.Contract(ContractABI['abi'], sponsor);
    console.log("contract address", sponsor);
    console.log("funding with ", wagerAmount)
    const wei = web3.utils.toWei(wagerAmount, 'ether')

    try{
        console.log(contract.methods);
        const fundContract = await contract.methods.addBettor(selectedValue).send({ from: from, value: wei });
        console.log(fundContract);
    }catch(error){
        console.log(error);
    }
    
  }

  async function callCashoutFunction(){

    const airnodeAddress = "0xB0B2C57c67aB89c3c65480C4aDE37b66d418c68e";
    const airnodeXpub =
      "xpub6C9hFCLsUsU1dPMDaf5cDKiFwxUsET6zmAHxqLWaUBW2jJejjW2GpAxMY4HAeHkBGxeu9hdSyDoLJM7R23jGTfYekWjMcLvtvzrKszarDGY";
    const endpointId =
      "0x6e58ace4ab94d28da59ec1da675b513cc21a3ca9656228c0b052563a2eb88b3e";
    // const sponsor = RrpRequester.address;

    
    // const sponsorWallet = await airnodeAdmin.deriveSponsorWalletAddress(
    // airnodeXpub,
    // airnodeAddress,
    // sponsor
    // );

    const sponsorWallet = "0x1afB6039ff1DA423E58AE30E75aCFFACDA92cb84";
    const params = [
    { type: "string", name: "seasonID", value: "6" },
    { type: "string", name: "_path", value: "data.0.id" },
    { type: "string", name: "_type", value: "int256" },
    ];
    const encodedParameters = web3.eth.abi.encodeParameters(params.map(p => p.type), params.map(p => p.value));

    console.log(encodedParameters);

    console.log("args for call are", airnodeAddress, endpointId, sponsor, sponsorWallet, encodedParameters)

    const contract = new web3.eth.Contract(ContractABI['abi'], sponsor);
    try{
        const receipt = await contract.methods.claimWinnings(
            airnodeAddress,
            endpointId, //endpointId
            sponsor,
            sponsorWallet,
            encodedParameters,
            { gasLimit: 500000 }
          ).call();

          console.log("receipt", receipt);
    }catch (error){
        console.log(error)
    }
  }


return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6">BetSquared</Typography>
        </Toolbar>
        </AppBar>
        <Paper elevation={3} style={{
          margin: '16px',
          padding: '16px',
          width: '100%',
          maxWidth: '65%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <Card
        elevation={3}
        style={{
          margin: theme.spacing(4),
          padding: theme.spacing(4),
          width: '100%',
          maxWidth: '65%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Typography variant="h4">Bet On Race 🏎️</Typography>

        <Select
          label="Select a value"
          variant="outlined"
          value={selectedValue}
          onChange={handleSelectedValueChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="1">Hamilton</MenuItem>
          <MenuItem value="2">Alonso</MenuItem>
          <MenuItem value="3">Verstappen</MenuItem>
          <MenuItem value="4">Mansell</MenuItem>
        </Select>

        <TextField
          label="Wager (Eth)"
          variant="outlined"
          type="number"
          value={wagerAmount}
          onChange={handleWagerAmountChange}
          fullWidth
          margin="normal"
          inputProps={{
            min: 0.001,
            max: 100,
            step: 0.1,
          }}
        />

        <Button
          onClick={callContractFunction}
          disabled={!contract}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          style={{ marginTop: theme.spacing(2) }}
        >
          Place Bet 🎫
        </Button>
      </Card>

      <Card
        elevation={3}
        style={{
          margin: theme.spacing(4),
          padding: theme.spacing(4),
          width: '100%',
          maxWidth: '65%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Typography variant="h4">Cash out winnings 💸</Typography>

        <Button
          onClick={callCashoutFunction}
          disabled={!contract}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          style={{ marginTop: theme.spacing(2) }}
        >
          Cash out 💵
        </Button>
      </Card>      
        </Paper>
    </ThemeProvider>
    );
}

export default Web3Example;
