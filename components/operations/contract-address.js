import Link from 'next/link';
import truncateEthAddress from 'truncate-eth-address';
import {useState} from 'react';
import {ClipboardToast} from './clipboardToast.js';

export function ContractAddress({address}) {

  const [showToast, setShowToast] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(address);
    setShowToast(true);
  }

  return (
    <span className="flex">
      <ClipboardToast show={showToast} setShow={setShowToast}/>
      {truncateEthAddress(address)}
      <button className="link ml-1" onClick={copyAddress}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </button>
      <Link href={`https://etherscan.io/address/${address}`}>
        <a className="link ml-1" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
      </Link>
    </span>
  );
}
