import {authContext, signOut} from '../../lib/client/authHandler.js';
import {useContext} from 'react';

export default function SignOutButton({closeMenu}) {

  const { setIsAuthenticated } = useContext(authContext);

  function handleSignOut() {
    signOut();
    setIsAuthenticated(false);
    if(closeMenu) {
      closeMenu();
    }
  }

  return <button className="button" onClick={handleSignOut}>Sign out</button>;
}
