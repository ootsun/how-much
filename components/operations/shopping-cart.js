import {useEffect, useState} from 'react';
import {getById, refreshPricesAutomatically} from '../../lib/client/operationHandler.js';
import {ShoppingCartItem} from './shopping-cart-item.js';
import {atCurrentGasPriceInUSD} from '../../lib/ethereum/ethereumUtils.js';
import {roundPrice} from '../../lib/utils/numberUtils.js';
import {ERROR_MESSAGES} from "../../lib/client/constants.js";

// Avoid useEffect being run twice because of reactStrictMode
// https://beta.reactjs.org/learn/you-might-not-need-an-effect#initializing-the-application
let intervalId = null;

export function ShoppingCart({lastSelected, setLastSelected, setAverageSum, setMaxSum}) {
  const LOCAL_STORAGE_SELECTED_OPS_KEY = 'shopping-cart-selected-operations';

  const [selectedOperations, setSelectedOperations] = useState([]);
  const [currentEtherPrice, setCurrentEtherPrice] = useState(null);
  const [currentGasPrice, setCurrentGasPrice] = useState(null);

  useEffect(() => {
    const retrieveFromLocalStorage = async () => {
      const savedOpIds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_OPS_KEY));
      if(savedOpIds) {
        const promises = [];
        for(const id of savedOpIds) {
          promises.push(getById(id));
        }

        try {
          const responses = await Promise.all(promises);
          const savedOps = [];
          for(const res of responses) {
            try {
              if (!res.ok) {
                const data = await res.json();
                console.error('Error while retrieving an operation based on shopping cart local storage :', data.error);
                if(res.status === 404) {
                  removeObsoleteFromCart(res);
                }
                return;
              }
              savedOps.push(await res.json());
            } catch (e) {
              console.error('Error while retrieving an operation based on shopping cart local storage :', e);
            }
          }
          setSelectedOperations(savedOps);
          refreshShoppingCartSums(savedOps);
        } catch (e) {
          console.error('Error while retrieving an operation based on shopping cart local storage :', e);
        }
      }
    }
    retrieveFromLocalStorage();
  }, []);

  useEffect(() => {
    if(lastSelected) {
      const updated = [...selectedOperations, lastSelected];
      setSelectedOperations(updated);
      saveInLocalStorage(updated);
      setLastSelected(null);
      refreshShoppingCartSums(updated);
    }
  }, [lastSelected]);

  useEffect(refreshShoppingCartSums, [currentGasPrice]);

  useEffect(() => {
    if(intervalId == null) {
      intervalId = refreshPricesAutomatically(setCurrentEtherPrice, setCurrentGasPrice);
      return () => clearInterval(intervalId);
    }
  }, []);

  function getPriceInUSD(gasQuantity) {
    if (currentEtherPrice && currentGasPrice) {
      return roundPrice(atCurrentGasPriceInUSD(gasQuantity, currentEtherPrice, currentGasPrice));
    } else {
      return null;
    }
  }

  function refreshShoppingCartSums(operations = selectedOperations) {
    if (currentEtherPrice && currentGasPrice) {
      let averageSum = 0;
      let maxSum = 0;
      for (const operation of operations) {
        averageSum += atCurrentGasPriceInUSD(operation.averageGasUsage, currentEtherPrice, currentGasPrice);
        maxSum += atCurrentGasPriceInUSD(operation.maxGasUsage, currentEtherPrice, currentGasPrice);
      }
      setAverageSum(roundPrice(averageSum));
      setMaxSum(roundPrice(maxSum));
    }
  }

  function onRemove(operation) {
    const index = selectedOperations.indexOf(operation);
    selectedOperations.splice(index, 1);
    setSelectedOperations(selectedOperations);
    saveInLocalStorage(selectedOperations);
    refreshShoppingCartSums();
  }

  const saveInLocalStorage = (operations) => {
    localStorage.setItem(LOCAL_STORAGE_SELECTED_OPS_KEY, JSON.stringify(operations.map(o => o._id)));
  }

  const removeObsoleteFromCart = (res) => {
    const operationId = res.url.split('/').pop();
    const operation = selectedOperations.find(o => o._id === operationId);
    onRemove(operation);
  }

  console.log(selectedOperations)

  return (
    <>
      <ul>
        {selectedOperations.map((operation, index) =>
          <ShoppingCartItem operation={operation}
                            averagePrice={getPriceInUSD(operation.averageGasUsage)}
                            maxPrice={getPriceInUSD(operation.maxGasUsage)}
                            onRemove={onRemove}
                            key={index}/>
        )}
      </ul>
    </>
  );
}
