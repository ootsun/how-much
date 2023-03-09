import {ethers} from 'ethers';
import {SiweMessage} from 'siwe';
import {useContext, useState} from 'react';
import {authContext, getNonce, signOut, verifySignature} from '../../lib/client/authHandler.js';
import {LoadingCircle} from '../loading-circle.js';
import {init, useConnectWallet} from "@web3-onboard/react";
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseWallet from '@web3-onboard/coinbase';
import Router from 'next/router';

const injected = injectedModule();
const walletConnect = walletConnectModule();
const coinbase = coinbaseWallet();

const rpcUrl = `https://mainnet.infura.io/v3/NO_INFURA_KEY_NEEDED_FOR_THIS_APP`;

// initialize Onboard
init({
  wallets: [injected, walletConnect, coinbase],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum',
      rpcUrl
    }
  ],
  appMetadata: {
    name: 'How Much',
    icon: 'logo.svg',
    logo: 'logo-large.png',
    description: 'How much is a free online tool to help you estimate your transaction costs on Ethereum.',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io/' },
    ],
  },
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
})

export default function ConnectionButton({closeMenu}) {

  let [isLoading, setIsLoading] = useState(false);
  // let [modalMessage, setModalMessage] = useState(null);

  const {isAuthenticated, setIsAuthenticated} = useContext(authContext);

  const [{wallet, connecting}, connect, disconnect] = useConnectWallet();

  async function createSiweMessage(address, statement) {
    let res = null;
    try {
      res = await getNonce(address);
    } catch (e) {
      console.error(e);
      //FIXME modal doesn't show up if created in the header
      // setModalMessage(ERROR_MESSAGES.connection);
      // toggleModal("signInButtonErrorModal");
      return false;
    }
    if (res.ok) {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement,
        uri: window.location.origin,
        version: '1',
        chainId: '1',
        nonce: await res.json()
      });
      return message.prepareMessage();
    }
    console.error(res);
    // setModalMessage(ERROR_MESSAGES.serverSide);
    // toggleModal("signInButtonErrorModal");
    return false;
  }

  async function connectWalletAndSignIn() {
    setIsLoading(true);
    const wallets = await connect();
    if (wallets && wallets[0]) {
      const p = new ethers.providers.Web3Provider(wallets[0].provider, 'any');
      await signInWithEthereum(p.getSigner());
    }
    setIsLoading(false);
  }

  async function signInWithEthereum(s) {
    try {
      const message = await createSiweMessage(
        await s.getAddress(),
        'Sign in with Ethereum to the app.'
      );
      if (message) {
        const signature = await s.signMessage(message);
        if (signature) {
          const res = await verifySignature(message, signature);
          if (res) {
            setIsAuthenticated(true);
          } else {
            // setModalMessage('The server couldn\'t verify your signature. Please, retry later.');
            // toggleModal("operationListErrorModal");
            console.error(res);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSignOut() {
    signOut();
    if (wallet) {
      await disconnect({label: wallet.label});
    }
    setIsAuthenticated(false);
    if (closeMenu) {
      closeMenu();
    }
    await Router.push('/');
  }

  return (
    <>
      {/*<ErrorModal message={modalMessage} customId="signInButtonErrorModal"/>*/}
      {isAuthenticated ? <button className="button" onClick={handleSignOut}>Sign out</button> :
        <button className="button" onClick={connectWalletAndSignIn} disabled={isLoading || connecting}>
          {isLoading && <LoadingCircle/>}Connect your wallet & sign in
        </button>
      }
    </>);
}
