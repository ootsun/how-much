import {useContext, useEffect, useState} from 'react';
import {getById} from '../../../lib/client/operationHandler.js';
import {ShoppingCartItem} from './shopping-cart-item.js';
import {atCurrentGasPriceInUSD} from '../../../lib/ethereum/ethereumUtils.js';
import {roundPrice} from '../../../lib/utils/numberUtils.js';
import {ERROR_MESSAGES} from "../../../lib/client/constants.js";
import { currentPricesContext} from "../../../pages/_app.js";
import ShoppingCartHeader from "./shopping-cart-header.js";

export function ShoppingCart({lastSelected, setLastSelected}) {
  const LOCAL_STORAGE_SELECTED_OPS_KEY = 'shopping-cart-selected-operations';

  const [averageSum, setAverageSum] = useState('0');
  const [maxSum, setMaxSum] = useState('0');
  const [selectedOperations, setSelectedOperations] = useState(null);
  const currentPrices = useContext(currentPricesContext);
  const currentGasPrice = currentPrices?.gasPriceInWei;
  const currentEtherPrice = currentPrices?.etherPrice;

  useEffect(() => {
    if(lastSelected) {
      const updated = [...selectedOperations, lastSelected];
      setSelectedOperations(updated);
      saveInLocalStorage(updated);
      setLastSelected(null);
      refreshShoppingCartSums(updated);
    }
  }, [lastSelected]);

  useEffect(() => {
    refreshShoppingCartSums()
  }, [currentPrices, selectedOperations]);

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
                await removeObsoleteFromCart(res);
              }
              return;
            }
            savedOps.push(await res.json());
          } catch (e) {
            console.error('Error while retrieving an operation based on shopping cart local storage :', e);
          }
        }
        setSelectedOperations(savedOps);
      } catch (e) {
        console.error('Error while retrieving an operation based on shopping cart local storage :', e);
      }
    }
  }

  function getPriceInUSD(gasQuantity) {
    if (currentPrices) {
      return roundPrice(atCurrentGasPriceInUSD(gasQuantity, currentPrices.etherPrice, currentPrices.gasPriceInWei));
    } else {
      return null;
    }
  }

  async function refreshShoppingCartSums(operations = selectedOperations) {
    if (!operations) {
      await retrieveFromLocalStorage();
    }
    if (currentPrices && operations?.length > 0) {
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

  async function onRemove(operation) {
    const index = selectedOperations.indexOf(operation);
    selectedOperations.splice(index, 1);
    setSelectedOperations(selectedOperations);
    saveInLocalStorage(selectedOperations);
    await refreshShoppingCartSums();
  }

  const saveInLocalStorage = (operations) => {
    localStorage.setItem(LOCAL_STORAGE_SELECTED_OPS_KEY, JSON.stringify(operations.map(o => o._id)));
  }

  const removeObsoleteFromCart = async (res) => {
    const operationId = res.url.split('/').pop();
    const operation = selectedOperations.find(o => o._id === operationId);
    await onRemove(operation);
  }

  return (
    <>
      <ShoppingCartHeader averageSum={averageSum} maxSum={maxSum} selectedOperations={selectedOperations}/>
      <ul>
        {selectedOperations?.map((operation, index) =>
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
