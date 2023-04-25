import '../styles/globals.css'
import Header from '../components/header/header.js';
import Footer from '../components/footer.js';
import {createContext, useEffect, useState} from 'react';
import {getUserCanEdit, isStillAuthenticated} from '../lib/client/authHandler.js';
import WelcomeBanner from '../components/welcome-banner.js';
import {BLOCK_INTERVAL_IN_MS} from "../lib/ethereum/ethereumUtils.js";

function MyApp({Component, pageProps}) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [currentPrices, setCurrentPrices] = useState(null);
  const [blockCountdown, setBlockCountdown] = useState(0);
  const [pageIsVisible, setPageIsVisible] = useState(true);

  useEffect(() => {
    import('flowbite');
    const stillAuthenticated = isStillAuthenticated();
    if (stillAuthenticated) {
      setIsAuthenticated(stillAuthenticated);
      setCanEdit(getUserCanEdit());
    }
  }, []);

  useEffect(() => {
    const initCountdown = () => {
      return setInterval(() => {
        setBlockCountdown(prevCountdown => {
          if (prevCountdown === 0) {
            return BLOCK_INTERVAL_IN_MS - 1000; // reset to 11s
          } else {
            return prevCountdown - 1000;
          }
        });
      }, 1000);
    }

    const intervalId = initCountdown();

    document.addEventListener("visibilitychange", () => {
      setPageIsVisible(!document.hidden);
    });
    return () => clearInterval(intervalId)
  }, []);

  useEffect(() => {
    const refreshPrices = async () => {
      if(pageIsVisible) {
        try {
          const res = await fetch('/api/ethereum/prices');
          if (res.ok) {
            const data = await res.json();
            setCurrentPrices(data);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        console.log('Page is not visible, not refreshing prices.')
      }
    }

    if (blockCountdown === 0) {
      refreshPrices();
    }
  }, [blockCountdown]);

  return (
    <authContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
      <editorContext.Provider value={{canEdit, setCanEdit}}>
        <currentPricesContext.Provider value={currentPrices}>
          <blockCountdownContext.Provider value={blockCountdown}>
            <div className="flex justify-between flex-col min-h-screen">
              <div>
                <Header/>
                <main className="px-2 sm:px-5 mt-5">
                  <Component {...pageProps}/>
                </main>
              </div>
              <WelcomeBanner/>
              <Footer/>
            </div>
          </blockCountdownContext.Provider>
        </currentPricesContext.Provider>
      </editorContext.Provider>
    </authContext.Provider>
  );
}

export const authContext = createContext({});
export const editorContext = createContext({});
export const currentPricesContext = createContext({});
export const blockCountdownContext = createContext({});

export default MyApp
