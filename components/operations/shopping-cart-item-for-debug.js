import {ProjectNameLogo} from '../projects/project-name-logo.js';
import {Disclosure} from '@headlessui/react'
import {ChevronUpIcon} from '@heroicons/react/solid';
import {useEffect, useState} from 'react';
import {LoadingCircle} from '../loading-circle.js';
import {atCurrentGasPriceInUSD} from '../../lib/ethereum/ethereumUtils.js';

export function ShoppingCartItemForDebug({operation, currentEtherPrice, currentGasPrice}) {

  const [minPrice, setMinPrice] = useState(null);
  const [averagePrice, setAveragePrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [median, setMedian] = useState(null);
  const [ecart, setEcart] = useState(null);
  const [ecartPourcent, setEcartPourcent] = useState(null);

  useEffect(() => {
    if(currentEtherPrice && currentGasPrice) {
      setMinPrice(atCurrentGasPriceInUSD(operation.minGasUsage, currentEtherPrice, currentGasPrice));
      setAveragePrice(atCurrentGasPriceInUSD(operation.averageGasUsage, currentEtherPrice, currentGasPrice));
      setMaxPrice(atCurrentGasPriceInUSD(operation.maxGasUsage, currentEtherPrice, currentGasPrice));
      setMedian(atCurrentGasPriceInUSD(computeMedian(), currentEtherPrice, currentGasPrice));
      let ecartTyp = ecartType();
      setEcart(atCurrentGasPriceInUSD(ecartTyp, currentEtherPrice, currentGasPrice));
      setEcartPourcent(Math.round(ecartTyp/operation.averageGasUsage*100));
    }
  }, [currentEtherPrice, currentGasPrice]);

  function computeMedian(){
    operation.lastGasUsages.sort((a,b) => a - b)

    var half = Math.floor(operation.lastGasUsages.length / 2);

    if (operation.lastGasUsages.length % 2)
      return operation.lastGasUsages[half];

    return Math.round((operation.lastGasUsages[half - 1] + operation.lastGasUsages[half]) / 2.0);
  }

  function ecartType() {
    let sum = 0;
    for(let usage of operation.lastGasUsages) {
      sum += Math.pow(Math.abs(operation.averageGasUsage - usage), 2)
    }
    return Math.round(Math.sqrt(sum/operation.lastGasUsages.length))
  }

  return (
    <li>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="py-2 flex items-center justify-between w-full hover:bg-fuchsia-200 rounded-lg px-1 transition duration-200">
              <ProjectNameLogo project={operation.project}/>
              <span className="function-name ml-2">{operation.functionName}</span>
              {averagePrice !== null && <>
                <span className="bg-blue-500 mx-1 text-white bold px-1">${minPrice}</span>
                <span className="bg-green-500 mx-1 text-white bold px-1">${averagePrice}</span>
                <span className="bg-yellow-500 mx-1 text-white bold px-1">${median}</span>
                <span className="bg-red-500 mx-1 text-white bold px-1">${ecart}</span>
                <span className="bg-orange-500 mx-1 text-white bold px-1">{ecartPourcent}%</span>
                <span className="bg-pink-500 mx-1 text-white bold px-1">${maxPrice}</span>
              </>}
              {averagePrice === null && <LoadingCircle/>}
              <ChevronUpIcon className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`}/>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-2 text-sm text-gray-500">
              {minPrice !== null && maxPrice !== null &&
                <>
                  <span className="bg-fuchsia-300">${minPrice}</span>
                  <span className="bg-fuchsia-500">${maxPrice}</span>
                </>
              }
              {(minPrice === null || maxPrice === null) &&
                <LoadingCircle/>
              }
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </li>
  );
}
