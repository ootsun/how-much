import {ShoppingCartIcon} from "@heroicons/react/outline";

export default function ShoppingCartHeader({averageSum, maxSum, selectedOperations}) {

  const cartIsEmpty = selectedOperations?.length === 0;

  const buildTotalBadge = (type, value) => {
    return (
      <th className="font-normal">
        <div className={type === 'avg' ? 'avg-price-header' : 'max-price-header'}>
          <span className="block sm:inline text-center text-xs text-white">{type}</span>
          <span className="border-white inline-border-t sm:border-l sm:ml-1 sm:pl-1 bg-white rounded px-1">${value}</span>
        </div>
      </th>
    );
  }

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
        {buildTotalBadge('avg', averageSum)}
        {buildTotalBadge('max', maxSum)}
      </>
      }
    </tr>
  )
}
