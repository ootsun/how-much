import {authContext, signOut} from '../../lib/client/authHandler.js';
import {useContext} from 'react';

export default function SignOutButton() {

  const { setIsAuthenticated } = useContext(authContext);

  function handleSignOut() {
    signOut();
    setIsAuthenticated(false);
  }

  return <button className="button" onClick={handleSignOut}>Sign out</button>;
}
