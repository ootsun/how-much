import {ShoppingCartIcon} from "@heroicons/react/outline";

export default function ShoppingCartHeader({averageSum, maxSum, selectedOperations}) {

  const cartIsEmpty = selectedOperations?.length === 0;

  return (
    <tr className="text-left">
      <th colSpan={2} className="font-normal">
        <div className={`flex basis-3/5 pr-1 items-center`}>
          <ShoppingCartIcon className="w-10 h-10"/>
          <h2 className="text-2xl hidden sm:block leading-6">Shopping cart
            {cartIsEmpty &&
              <span className="ml-1 text-gray-500 text-sm">(Empty)</span>
            }
          </h2>
        </div>
      </th>
      {!cartIsEmpty && <>
        <th className="font-normal">
          <span className="average-price">Avg&nbsp;
            <span className="border-l border-white ml-1 pl-1 ">${averageSum}</span>
          </span>
        </th>
        <th className="font-normal">
          <span className="max-price">Max&nbsp;
            <span className="border-l border-white ml-1 pl-1">${maxSum}</span>
          </span>
        </th>
      </>
      }
    </tr>
  )
}
