import {ProjectNameLogo} from '../../projects/project-name-logo.js';
import {LoadingCircle} from '../../loading-circle.js';
import {FunctionName} from "../function-name.js";

export function ShoppingCartItem({operation, averagePrice, maxPrice, onRemove}) {

  let pricesSection;
  if (averagePrice !== null && maxPrice !== null) {
    pricesSection = (
      <>
        <td className="text-center">
          <span><span className="">{averagePrice}</span></span>
        </td>
        <td className="text-center">
          <span><span className="">{maxPrice}</span></span>
        </td>
      </>
    );
  } else {
    pricesSection = <td colSpan={2}><LoadingCircle color={true}/></td>;
  }

  return (
    <tr onClick={() => onRemove(operation)}
        className="py-1 md:pl-3 w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition duration-200 animate-shopping-cart-item">
        <td>
            <ProjectNameLogo operation={operation} project={operation.project}/>
        </td>
        <td className="py-1">
          <FunctionName name={operation.functionName} tooltip={true}/>
        </td>
        {pricesSection}
    </tr>
  );
}
