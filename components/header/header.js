import Link from 'next/link';
import {slide as Menu} from 'react-burger-menu';
import ConnectionButton from './connection-button.js';
import {useContext, useState} from 'react';
import {ProfileAvatar} from './profile-avatar.js';
import {WenClaim} from './wen-claim.js';
import {NavItems} from './nav-items.js';
import {authContext} from "../../pages/_app.js";

export default function Header() {

  const {isAuthenticated} = useContext(authContext);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  function closeMenu() {
    setMenuIsOpen(false);
  }

  function handleStateChange(state) {
    setMenuIsOpen(state.isOpen);
  }

  return (
    <header className="flex h-16 justify-between">
      <div className="flex-1 flex md:items-center">
        <span className="md:hidden">
          <Menu styles={burgerStyles} isOpen={menuIsOpen} onStateChange={handleStateChange}>
            <div className="flex w-full justify-center flex-col items-center menu-wrapper">
              <WenClaim/>
              {process.env.NEXT_PUBLIC_AUTHENTICATION_ENABLED === 'true' &&
              <>
                {isAuthenticated &&
                  <NavItems inBurger={true} closeMenu={closeMenu}/>
                }
                <ConnectionButton closeMenu={closeMenu}/>
              </>
              }
            </div>
          </Menu>
        </span>
        {isAuthenticated &&
        <div className="hidden md:block">
          <NavItems/>
        </div>
        }
      </div>
      <h1 className="text-center text-4xl font-cursive flex-2 flex items-center mx-3 md:mx-6">
        <Link href="/">
          <a>
            <span className="m-1">How much</span>
            <span className="text-orange-500">?</span>
            <span className="text-cyan-500 rotate-[11deg] inline-block mr-0.5">!</span>
            <span className="text-fuchsia-500 rotate-[22deg] inline-block m-0.5">!</span>
          </a>
        </Link>
      </h1>
      <div className="flex-1 flex justify-between items-center mr-5">
        <span className="hidden md:inline-flex ">
          <WenClaim/>
        </span>
        {process.env.NEXT_PUBLIC_AUTHENTICATION_ENABLED === 'true' &&
        <>
          {isAuthenticated && <div className="ml-auto md:ml-0"><ProfileAvatar/></div>}
          <div className="hidden md:inline"><ConnectionButton/></div>
        </>
        }
      </div>
    </header>
  );
}

const burgerStyles = {
  bmBurgerButton: {
    position: 'relative',
    width: '36px',
    height: '30px',
    marginLeft: '1.25rem',
    marginTop: '1rem',
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
    height: '100%',
    top: 0
  },
  bmMenu: {
    background: 'rgb(55 65 81 / var(--tw-bg-opacity))',
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
    display: 'flex'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
    top: 0
  }
}
