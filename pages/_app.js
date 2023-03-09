import '../styles/globals.css'
import Header from '../components/header/header.js';
import Footer from '../components/footer.js';
import {createContext, useEffect, useState} from 'react';
import {isStillAuthenticated} from '../lib/client/authHandler.js';
import WelcomeBanner from '../components/welcome-banner.js';

function MyApp({Component, pageProps}) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    import('flowbite');
    setIsAuthenticated(isStillAuthenticated());
  }, []);

  return (
    <authContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
      <editorContext.Provider value={{canEdit, setCanEdit}}>
        <div className="flex justify-between flex-col min-h-screen">
          <div>
            <Header/>
            <main className="px-5 mt-5">
              <Component {...pageProps}/>
            </main>
          </div>
          <WelcomeBanner/>
          <Footer/>
        </div>
      </editorContext.Provider>
    </authContext.Provider>
  );
}

export const authContext = createContext({});

export const editorContext = createContext({});

export default MyApp
