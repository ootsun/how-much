import {useMobileDisplayHook} from "../../lib/client/hooks/use-mobile-display-hook.js";
import {InformationCircleIcon} from '@heroicons/react/outline';
import {Tooltip} from "flowbite-react";

export function FunctionName({name, tooltip = false}) {

  const isMobileDisplay = useMobileDisplayHook();

  const formatCamelCaseToWords = (str) => {
    // Split the string into two parts at the capital letter, lowercase letter, or digit
    const regex = /([a-z0-9]+|[A-Z0-9]+(?![a-z])|[A-Z0-9][a-z0-9]*)/g;
    const parts = str.match(regex);

    // If there is only one part, return it as-is
    if (parts.length === 1) {
      return capitalizeFirstLetter(parts[0]);
    }

    // Capitalize the first letter of the first word and join the parts with a space in between
    parts[0] = capitalizeFirstLetter(parts[0]);
    const formattedParts = parts.map(part => capitalizeFirstLetter(part));
    return formattedParts.join(' ');
  }

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if(tooltip && isMobileDisplay) {
    return (
      <Tooltip content={formatCamelCaseToWords(name)}>
        <InformationCircleIcon className="information-circle" onClick={event => event.stopPropagation()}/>
      </Tooltip>
    );
  }

  return (
    <span className="function-name">{formatCamelCaseToWords(name)}</span>
  );
}
