import {InformationCircleIcon, ShoppingCartIcon} from "@heroicons/react/outline";
import {GasStation} from "./gas-station.js";

export default function ShoppingCartHeader({averageSum, maxSum, selectedOperations}) {

  const cartIsEmpty = selectedOperations?.length === 0;

  return (
    <>
      <p className="italic align-middle mb-1 md:ml-3 flex justify-between">
            <span>
              <InformationCircleIcon className="information-circle"/>
              Click on a row to remove it
            </span>
        <GasStation/>
      </p>
      <div className={`flex justify-between items-center pb-1.5 ${cartIsEmpty ? '' : 'border-gray-200 border-b'}`}>
        <div className={`flex basis-3/5 pr-1 items-center`}>
          <ShoppingCartIcon className="w-10 h-10 ml-[-10px] md:ml-0.5"/>
          <h2 className="text-2xl hidden sm:block leading-6">Shopping cart
            {cartIsEmpty &&
              <span className="ml-1 text-gray-500 text-sm">(Empty)</span>
            }
          </h2>
        </div>
        {!cartIsEmpty && <>
              <span className="basis-1/5 pr-1">
                <span className="average-price">Avg&nbsp;
                  <span className="border-l border-white ml-1 pl-1 ">${averageSum}</span>
                </span>
              </span>
          <span className="basis-1/5">
                <span className="max-price">Max&nbsp;
                  <span className="border-l border-white ml-1 pl-1">${maxSum}</span>
                </span>
              </span>
        </>
        }
      </div>
    </>
  )
}
