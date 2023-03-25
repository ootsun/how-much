import {ProjectNameLogo} from '../projects/project-name-logo.js';
import {LoadingCircle} from '../loading-circle.js';
import {FunctionName} from "./function-name.js";

export function ShoppingCartItem({operation, averagePrice, maxPrice, onRemove}) {

  return (
    <li onClick={() => onRemove(operation)}
        className="py-1 md:pl-3 w-full hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer flex items-center animate-shopping-cart-item">
        <span className="basis-2/5 pr-1">
            <ProjectNameLogo operation={operation} project={operation.project}/>
        </span>
        <span className="basis-3/5 flex justify-between">
          <span className="pr-1">
            <FunctionName name={operation.functionName}/>
          </span>
          {averagePrice !== null && maxPrice !== null &&
          <>
            <span className="pr-1">
              <span className="average-price-sm">${averagePrice}</span>
            </span>
            <span>
              <span className="max-price-sm">${maxPrice}</span>
            </span>
          </>
          }
          {(averagePrice === null || maxPrice === null) && <LoadingCircle color={true}/>}
        </span>
    </li>
  );
}
