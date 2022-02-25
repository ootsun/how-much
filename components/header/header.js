import Link from 'next/link';
import {slide as Menu} from 'react-burger-menu';
import SignInButton from './signInButton.js';
import SignOutButton from './signOutButton.js';
import {useContext} from 'react';
import {authContext} from '../../lib/client/authHandler.js';
import {ProfileAvatar} from './profile-avatar.js';
import {WenClaim} from './wen-claim.js';
import {NavItems} from './nav-items.js';

export default function Header() {

  const {isAuthenticated} = useContext(authContext);

  return (
    <header className="flex h-16 justify-between">
      <div className="flex-1 flex md:items-center">
        <span className="md:hidden">
          <Menu styles={burgerStyles}>
            <div className="flex w-full justify-center flex-col items-center menu-wrapper">
              <WenClaim/>
              {isAuthenticated !== null && !isAuthenticated && <SignInButton/>}
              {isAuthenticated &&
                <>
                  <NavItems inBurger={true}/>
                  <SignOutButton/>
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
        {isAuthenticated !== null && !isAuthenticated && <div className="hidden md:inline"><SignInButton/></div>}
        {isAuthenticated && <>
          <div className="ml-auto md:ml-0"><ProfileAvatar/></div>
          <div className="hidden md:inline"><SignOutButton/></div>
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
    'margin-left': '1.25rem',
    'margin-top': '1rem',
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
    background: 'rgba(0, 0, 0, 0.3)'
  }
}
