import {useMobileDisplayHook} from "../../lib/client/hooks/use-mobile-display-hook.js";
import {InformationCircleIcon} from '@heroicons/react/outline';
import {Tooltip} from "flowbite-react";

export function FunctionName({name, tooltip = false}) {

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
