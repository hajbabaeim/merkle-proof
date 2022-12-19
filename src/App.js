import logo from './merkle.png';
import './App.css';
import { signInWithMetaMask } from './config';
import { useEffect, useId, useState } from 'react';
import { useMetaMask, useConnectedMetaMask } from "metamask-react";
import { ethers } from 'ethers';
import abiData from './MerkleNFT.json';
const Web3 = require('web3');
// require('dotenv').config()

function App() {
  const id = useId();
  const [add, setAdd] = useState('');
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  // useEffect(async () => {
  //   const web3 = new Web3(window.ethereum);
  //   const chainId = await web3.eth.getChainId();
  //   const publicAddress = (await web3.eth.requestAccounts())[0];
  //   console.log("🚀 ~ file: App.js:15 ~ useEffect ~ publicAddress", publicAddress)
    
  // }, []);
  const contractAddress = "0xa837C4dA57Bf06f89d2918df9be187e0921acbc1";
  const rpcUrl = "https://data-seed-prebsc-2-s3.binance.org:8545";

  const addToWhitelist = async (address) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    let contractAbi = abiData.abi;
    const contractInterface = new ethers.utils.Interface(contractAbi);
    const contract = new ethers.Contract(contractAddress, contractInterface, signer);
    try {
        return await contract.addToWhitelist(address);
    } catch (e) {
        return false;
    }
  };

  const mint = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    let contractAbi = abiData.abi;
    const contractInterface = new ethers.utils.Interface(contractAbi);
    const contract = new ethers.Contract(contractAddress, contractInterface, signer);
    try {
        return await contract.mint();
    } catch (e) {
        return false;
    }
  };

  if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>

  if (status === "unavailable") return <div>MetaMask not available :(</div>

  if (status === "notConnected") return <button onClick={connect}>Connect to MetaMask</button>

  if (status === "connecting") return <div>Connecting...</div>

  if (status === "connected") return (
    <div className='container'>
      <div>Connected wallet address: {account} on chain ID: {chainId}</div>
      <div>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <div>
        <label for="name">Insert address for whitelist:  </label>
        <input id={id} value={add} onInput={e => setAdd(e.target.value)}/>
        <button  onClick={() => addToWhitelist(add)}>ADD</button>
      </div>
      <div>
        <label for="name">Mint a NFT (if you be a whitelisted already!):  </label>
        <button  onClick={() => mint()}>MINT</button>
      </div>
    </div>
  )

  return null;
}


// function App() {
//   useEffect(async () => {
//     await signInWithMetaMask();
//   }, []);




// return (
//   <div className="App">
//     <header className="App-header">
//       <img src={logo} className="App-logo" alt="logo" />
//       <p>
//         Edit <code>src/App.js</code> and save to reload.
//       </p>
//       <a
//         className="App-link"
//         href="https://reactjs.org"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         Learn React
//       </a>
//     </header>
//   </div>
// );
// }

export default App;
