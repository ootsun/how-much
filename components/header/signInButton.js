import {ethers} from 'ethers';
import {SiweMessage} from 'siwe';
import {useEffect, useState} from 'react';
import ErrorModal from '../error-modal.js';

export default function SignInButton() {

  let [domain, setDomain] = useState(null);
  let [origin, setOrigin] = useState(null);
  let [provider, setProvider] = useState(null);
  let [signer, setSigner] = useState(null);
  let [walletIsConnected, setWalletIsConnected] = useState(false);
  let [isSignedIn, setIsSignedIn] = useState(false);
  let [modalMessage, setModalMessage] = useState(null);

  async function init() {
    if (window.ethereum) {
      setDomain(window.location.host);
      setOrigin(window.location.origin);
      let p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
      setSigner(p.getSigner());
      const account = await p.send('eth_accounts', [])
        .catch((e)=>console.error(e));
      setWalletIsConnected(account && account.length > 0);
    }
  }

  useEffect(() => {
    init();
  }, []);

  async function createSiweMessage(address, statement) {
    let res = null;
    try {
      res = await fetch('/api/nonce', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({address})
      });
    } catch (e) {
      setModalMessage("An error occured. Check you internet connectivity.");
      toggleModal('errorModal');
      return false;
    }
    if(res.ok) {
      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: '1',
        nonce: await res.text()
      });
      return message.prepareMessage();
    }
    setModalMessage("An server side error occurred. Please, retry later.");
    toggleModal('errorModal');
    return false;
  }

  async function connectWalletAndSignIn($event, secondTry) {
    if(provider) {
      const address = await provider.send('eth_requestAccounts', [])
        .catch(() => console.log('user rejected request'));
      if(address) {
        signInWithEthereum();
      }
    } else if(!secondTry) {
      init();
      connectWalletAndSignIn($event, true);
    } else {
      setModalMessage('No browser wallet detected.');
      toggleModal('errorModal');
    }
  }

  async function signInWithEthereum () {
    const message = await createSiweMessage(
      await signer.getAddress(),
      'Sign in with Ethereum to the app.'
    );
    if(message) {
      const signature = await signer.signMessage(message);
      if(signature) {
        const res = await fetch('/api/verify', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            signature
          }),
        });
        if(res.ok) {
          setIsSignedIn(true);
        } else {
          setModalMessage("The server couldn't verify your signature. Please, retry later.");
          toggleModal('errorModal');
        }
      }
    }
  }

  let content = <button className="button" onClick={connectWalletAndSignIn}>Connect your wallet & sign in with Ethereum</button>;
  if(isSignedIn) {
    content = <p>You are signed in!</p>;
  } else if(walletIsConnected) {
    content = <button className="button" onClick={signInWithEthereum}>Sign in with Ethereum</button>;
  }

  return (
    <>
      <ErrorModal
        modalMessage={modalMessage}/>
      {content}
    </>);
}
