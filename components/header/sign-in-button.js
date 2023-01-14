import {ethers} from 'ethers';
import {SiweMessage} from 'siwe';
import {useContext, useEffect, useState} from 'react';
import ErrorModal from '../modals/error-modal.js';
import {authContext, getNonce, verifySignature} from '../../lib/client/authHandler.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';

export default function SignInButton() {

  let [domain, setDomain] = useState(null);
  let [origin, setOrigin] = useState(null);
  let [provider, setProvider] = useState(null);
  let [signer, setSigner] = useState(null);
  let [walletIsConnected, setWalletIsConnected] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [modalMessage, setModalMessage] = useState(null);

  const {setIsAuthenticated} = useContext(authContext);

  const modalId = 'signInButtonErrorModal';

  const init = async () => {
    if (window.ethereum) {
      setDomain(window.location.host);
      setOrigin(window.location.origin);
      let p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
      setSigner(p.getSigner());
      const account = await p.send('eth_accounts', [])
          .catch((e) => console.error(e));
      setWalletIsConnected(account && account.length > 0);
    }
  }

  useEffect(() => {
    init();
  }, []);

  async function createSiweMessage(address, statement) {
    let res = null;
    try {
      res = await getNonce(address);
    } catch (e) {
      setModalMessage(ERROR_MESSAGES.connection);
      toggleModal(modalId);
      return false;
    }
    if (res.ok) {
      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: '1',
        nonce: await res.json()
      });
      return message.prepareMessage();
    }
    setModalMessage(ERROR_MESSAGES.serverSide);
    toggleModal(modalId);
    return false;
  }

  async function connectWalletAndSignIn($event, secondTry) {
    setIsLoading(true);
    if (provider) {
      const address = await provider.send('eth_requestAccounts', [])
        .catch(() => console.log('user rejected request'));
      if (address) {
        await signInWithEthereum();
      }
    } else if (!secondTry) {
      await init();
      await connectWalletAndSignIn($event, true);
    } else {
      setModalMessage('No browser wallet detected.');
      toggleModal(modalId);
      setIsLoading(false);
    }
  }

  async function signInWithEthereum() {
    setIsLoading(true);
    const message = await createSiweMessage(
      await signer.getAddress(),
      'Sign in with Ethereum to the app.'
    );
    if (message) {
      try {
        const signature = await signer.signMessage(message);
        if (signature) {
          const res = await verifySignature(message, signature);
          if (res) {
            setIsAuthenticated(true);
          } else {
            setModalMessage('The server couldn\'t verify your signature. Please, retry later.');
            toggleModal(modalId);
            setIsLoading(false);
          }
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  }

  let content = <button className="button" onClick={connectWalletAndSignIn} disabled={isLoading}>
    {isLoading && <LoadingCircle/>}Connect your wallet & sign in
  </button>;
  if (walletIsConnected) {
    content = <button className="button" onClick={signInWithEthereum} disabled={isLoading}>
      {isLoading && <LoadingCircle/>}Sign in
    </button>;
  }

  return (
    <>
      <ErrorModal message={modalMessage} customId={modalId}/>
      {content}
    </>);
}
