import Link from 'next/link';

export function ContractAddress({address}) {
  return (
    <Link href={`https://etherscan.io/address/${address}`}>
      <a className="link" target="_blank">{address}</a>
    </Link>
  );
}
