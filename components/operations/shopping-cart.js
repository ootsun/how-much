import {useEffect, useState} from 'react';
import {refreshPricesAutomatically} from '../../lib/client/operationHandler.js';
import {ShoppingCartItem} from './shopping-cart-item.js';
import {atCurrentGasPriceInUSD} from '../../lib/ethereum/ethereumUtils.js';
import {roundPrice} from '../../lib/utils/numberUtils.js';

export function ShoppingCart({lastSelected, setLastSelected, setAverageSum, setMaxSum}) {

  const [selectedOperations, setSelectedOperations] = useState([]);
  const [currentEtherPrice, setCurrentEtherPrice] = useState(null);
  const [currentGasPrice, setCurrentGasPrice] = useState(null);

  useEffect(() => {
    if(lastSelected) {
      const updated = [...selectedOperations, lastSelected];
      setSelectedOperations(updated);
      setLastSelected(null);
      refreshShoppingCartSums(updated);
    }
  }, [lastSelected]);

  useEffect(() => {
    const intervalId = refreshPricesAutomatically(setCurrentEtherPrice, setCurrentGasPrice);
    return clearInterval(intervalId);
  }, []);

  function getPriceInUSD(gasQuantity) {
    if (currentEtherPrice && currentGasPrice) {
      return roundPrice(atCurrentGasPriceInUSD(gasQuantity, currentEtherPrice, currentGasPrice));
    } else {
      return null;
    }
  }

  function refreshShoppingCartSums(operations) {
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
    refreshShoppingCartSums(selectedOperations);
  }

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
