import Link from 'next/link';
import {slide as Menu} from 'react-burger-menu';
import ConnectWallet from './connectWallet.js';

export default function Header() {
  return (
    <header className="flex h-16">
      <div className="menu-box flex-1">
        <span>
          <Menu styles={burgerStyles}>
            <div className="flex w-full">
              <div className="flex justify-center mb-5">
                <div>
                  <span className="text-orange-500">?</span>
                  <span className="text-cyan-500 rotate-[11deg] inline-block">!</span>
                  <span className="text-fuchsia-500 rotate-[22deg] inline-block">!</span>
                </div>
              </div>
              <ConnectWallet/>
            </div>
          </Menu>
        </span>
      </div>
      <h1 className="text-center text-4xl font-cursive menu-box flex-2 items-center">
        <span className="m-1">How much</span>
        <span className="text-orange-500">?</span>
        <span className="text-cyan-500 rotate-[11deg] inline-block mr-0.5">!</span>
        <span className="text-fuchsia-500 rotate-[22deg] inline-block m-0.5">!</span>
      </h1>
      <div className="menu-box flex-1 justify-around items-center">
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

const burgerStyles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    left: '1.25rem',
    top: '18px'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}
