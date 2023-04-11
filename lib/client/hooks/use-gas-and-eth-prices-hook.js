import {useEffect, useState} from "react";
import {BLOCK_INTERVAL_IN_MS} from "../../ethereum/ethereumUtils.js";

export function useGasAndEthPricesHook() {

  const [currentPrices, setCurrentPrices] = useState(null);

  useEffect(() => {
    const refreshPrices = async (setCurrentEtherPrice, setCurrentGasPrice) => {
      try {
        let res = await fetch('/api/ethereum/prices');
        if(res.ok) {
          const data = await res.json();
          setCurrentPrices(data);
          console.log(data)
        }
      } catch (e) {
        console.error(e);
      }
    }

    const refreshPricesAutomatically = () => {
      refreshPrices();
      return setInterval(() => {
        refreshPrices();
      }, BLOCK_INTERVAL_IN_MS);
    }
    refreshPricesAutomatically();
  }, []);

  return currentPrices;
}
