import {ethers} from 'ethers';
import {SiweMessage} from 'siwe';
import {useContext, useEffect, useState} from 'react';
import ErrorModal from '../modals/error-modal.js';
import {authContext, getNonce, signOut, verifySignature} from '../../lib/client/authHandler.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {init, useConnectWallet, useWallets} from "@web3-onboard/react";
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseWallet from '@web3-onboard/coinbase';

const injected = injectedModule();
const walletConnect = walletConnectModule();
const coinbase = coinbaseWallet();

const infuraKey = '2a4aae7e54ad474f8c0aa91edd39e5cd';
const rpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`;
const appMetadata = {
  name: 'How Much',
  icon: 'https://alchemix.fi/images/icons/alcx_med.svg',
  logo: 'https://alchemix.fi/images/icons/ALCX_Std_logo.svg',
  // icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="information-circle"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
  // logo: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="information-circle"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
  description: 'My app using Onboard',
  recommendedInjectedWallets: [
    {name: 'MetaMask', url: 'https://metamask.io'}
  ]
};
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
    name: 'Alchemix',
    icon: 'https://alchemix.fi/images/icons/alcx_med.svg',
    logo: 'https://alchemix.fi/images/icons/ALCX_Std_logo.svg',
    description: 'Self repaying, non-liquidatable loans. Your only debt is time.',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io/' },
      { name: 'Tally', url: 'https://tally.cash/' },
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
