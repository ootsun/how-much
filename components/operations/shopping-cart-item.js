import {ProjectNameLogo} from '../projects/project-name-logo.js';
import {LoadingCircle} from '../loading-circle.js';

export function ShoppingCartItem({operation, averagePrice, maxPrice, onRemove}) {

  return (
    <li onClick={() => onRemove(operation)}
        className="py-1 pl-1 w-full hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer flex animate-shopping-cart-item">
      <span className="basis-3/5 flex">
        <ProjectNameLogo project={operation.project}/>
        <span><span className="function-name ml-2">{operation.functionName}</span></span>
      </span>
      <span className="basis-2/5 flex items-center">
        {averagePrice !== null && maxPrice !== null &&
          <>
            <span className="basis-1/2">
              <span className="bg-fuchsia-500 mx-1 text-white bold px-1 text-sm">${averagePrice}</span>
            </span>
            <span className="basis-1/2">
              <span className="bg-orange-500 mx-1 text-white bold px-1 text-sm">${maxPrice}</span>
            </span>
          </>
        }
        {(averagePrice === null || maxPrice === null) && <LoadingCircle color={true}/>}
      </span>
    </li>
  );
}
