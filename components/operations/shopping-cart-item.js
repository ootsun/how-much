import {ProjectNameLogo} from '../projects/project-name-logo.js';
import {LoadingCircle} from '../loading-circle.js';

export function ShoppingCartItem({operation, averagePrice, maxPrice, onRemove}) {

  return (
    <li onClick={() => onRemove(operation)}
      className="py-1 pl-1 grid-cols-4 w-full hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer">
      <ProjectNameLogo project={operation.project}/>
      <span className="function-name ml-2 py-0.5">{operation.functionName}</span>
      {averagePrice !== null && maxPrice !== null &&
        <>
          <span className="bg-fuchsia-500 mx-1 text-white bold px-1 text-sm">${averagePrice}</span>
          <span className="bg-orange-500 mx-1 text-white bold px-1 text-sm">${maxPrice}</span>
        </>
      }
      {(averagePrice === null || maxPrice === null) && <LoadingCircle/>}
    </li>
  );
}
