import {useMobileDisplayHook} from "../../lib/client/hooks/use-mobile-display-hook.js";
import {InformationCircleIcon} from '@heroicons/react/outline';
import {Tooltip} from "flowbite-react";

export function FunctionName({name, inShoppingCart = false}) {

  const isMobileDisplay = useMobileDisplayHook();

  const formatCamelCaseToWords = (str) => {
    const regex = /([a-z0-9]+|[A-Z0-9]+(?![a-z])|[A-Z0-9][a-z0-9]*)/g;
    const parts = str.match(regex);

    // Capitalize the first letter and join the parts with a space in between
    const formattedParts = parts.map(part => capitalizeFirstLetter(part));
    return formattedParts.join(' ');
  }

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const content = (<span className={`${inShoppingCart || isMobileDisplay ? 'max-w-[7rem]' : ''} function-name`}>{formatCamelCaseToWords(name)}</span>);
  if(inShoppingCart && isMobileDisplay) {
    return (
      <InformationCircleIcon className="information-circle" onClick={event => event.stopPropagation()}/>
    );
  }

  return (
    <Tooltip content={formatCamelCaseToWords(name)}>
      {content}
    </Tooltip>
  );
}
