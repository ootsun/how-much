import {ProjectNameLogo} from '../../projects/project-name-logo.js';
import {LoadingCircle} from '../../loading-circle.js';
import {FunctionName} from "../function-name.js";

export function ShoppingCartItem({operation, averagePrice, maxPrice, onRemove}) {

  let pricesSection;
  if (averagePrice !== null && maxPrice !== null) {
    pricesSection = (
      <>
        <td className="pr-1">
          <span className="average-price-sm">${averagePrice}</span>
        </td>
        <td>
          <span className="max-price-sm">${maxPrice}</span>
        </td>
      </>
    );
  } else {
    pricesSection = <td colSpan={2}><LoadingCircle color={true}/></td>;
  }

  return (
    <tr onClick={() => onRemove(operation)}
        className="py-1 md:pl-3 w-full hover:bg-gray-100 rounded-lg cursor-pointer transition duration-200 animate-shopping-cart-item">
        <td>
            <ProjectNameLogo operation={operation} project={operation.project}/>
        </td>
        <td>
          <FunctionName name={operation.functionName} tooltip={true}/>
        </td>
        {pricesSection}
    </tr>
  );
}
