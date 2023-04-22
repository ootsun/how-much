import Link from 'next/link.js';

export function WenClaim() {

  return (
    <button className="link-wrapper group group-hover:from-primary group-hover:to-secondary">
      <Link href="https://wenclaim.xyz"
            target="_blank"
            title="Optimize the frequency of your claims and compounds in DeFi"
            className="group-hover:bg-opacity-0 font-cursive">
        <span className="m-0.5">Wen claim</span>
        <span className="text-amber-500">?</span>
        <span className="text-sky-500 rotate-[11deg] inline-block">?</span>
        <span className="text-pink-500 rotate-[22deg] inline-block">!</span>
      </Link>
    </button>
  );
}
