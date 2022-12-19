
import Web3 from "web3";
import { MetaMaskProvider } from "metamask-react";

export const continueWithMetaMask = async () => {
    const { ethereum } = window;

    if (!(ethereum && ethereum.isMetaMask)) {
        window.open('https://metamask.io/download/', '_blank');
        return;
    }

    const web3 = new Web3(window.ethereum);
    const chainId = await web3.eth.getChainId();
    await this.updateNetwork(chainId);
    const publicAddress = (await web3.eth.requestAccounts())[0];
    const message = ["Please sign this message so that we can verify it's you :)"].join('\n');
    // -------------------------------------------------------------------------
    // @ts-ignore
    const signature = await web3.eth.personal.sign(message, publicAddress);
    let acc = await web3.eth.requestAccounts();
    console.log(acc, signature);

    // localStorage.setItem('ACCESS_TOKEN', accessToken);
};

export const signInWithMetaMask = () => {
    if (window.ethereum) {
        this.continueWithMetaMask();
    } else {
        window.addEventListener('ethereum#initialized', this.continueWithMetaMask, {
            once: true
        });
        setTimeout(continueWithMetaMask, 3000); // 3 seconds
    }
};