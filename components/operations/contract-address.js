import Link from 'next/link';
import truncateEthAddress from 'truncate-eth-address';
import {useState} from 'react';
import {ClipboardToast} from './clipboard-toast.js';
import {ClipboardIcon, ExternalLinkIcon} from '@heroicons/react/outline';

export function ContractAddress({address}) {

  const [showToast, setShowToast] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(address);
    setShowToast(true);
  }

  return (
    <span className="flex" onClick={event => event.stopPropagation()}>
      <ClipboardToast show={showToast} setShow={setShowToast}/>
      {truncateEthAddress(address)}
      <button className="link ml-1" onClick={copyAddress}>
        <ClipboardIcon className="h-5 w-5"/>
      </button>
      <Link href={`https://etherscan.io/address/${address}`}>
        <a className="link ml-1" target="_blank">
          <ExternalLinkIcon className="h-5 w-5"/>
        </a>
      </Link>
    </span>
  );
}
