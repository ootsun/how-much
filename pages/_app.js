import '../styles/globals.css'
import Header from '../components/header/header.js';
import Footer from '../components/footer.js';
import {useEffect, useState} from 'react';
import {authContext, isStillAuthenticated} from '../lib/client/authHandler.js';

function MyApp({Component, pageProps}) {

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    import('flowbite');
    setIsAuthenticated(isStillAuthenticated());
  }, []);

  return (
    <authContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
      <div className="flex justify-between flex-col min-h-screen">
        <div>
          <Header/>
          <main className="px-5 mt-5">
            <Component {...pageProps}/>
          </main>
        </div>
        <Footer/>
      </div>
    </authContext.Provider>
  );
}

export default MyApp
