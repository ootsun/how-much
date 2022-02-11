import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex h-16">
      <div className="menu-box flex-1"><span></span></div>
      <h1 className="text-center text-4xl font-cursive menu-box flex-2">
        <span className="m-1">How much</span>
        <span className="text-orange-500">?</span>
        <span className="text-cyan-500 rotate-[11deg] inline-block mr-0.5">!</span>
        <span className="text-fuchsia-500 rotate-[22deg] inline-block m-0.5">!</span>
      </h1>
      <div className="menu-box flex-1">
        <Link href="https://wenclaim.xyz">
          <a target="_blank"
             title="Optimize the frequency of your claims and compounds in DeFi"
             className="hidden md:inline button button-link font-cursive">
            <span className="m-0.5">Wen claim</span>
            <span className="text-amber-500">?</span>
            <span className="text-sky-500 rotate-[11deg] inline-block">?</span>
            <span className="text-pink-500 rotate-[22deg] inline-block">!</span>
          </a>
        </Link>
      </div>
    </header>
  );
}
