
export function FunctionName({name}) {

  const formatCamelCaseToWords = (str) => {
    // Split the string into two parts at the capital letter, lowercase letter, or digit
    const regex = /([a-z0-9]+|[A-Z][a-z0-9]*)/g;
    const parts = str.match(regex);

    // If there is only one part, return it as-is
    if (parts.length === 1) {
      return parts[0];
    }

    // Capitalize the first letter of the first word and join the parts with a space in between
    parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const formattedParts = parts.map(part => {
      if (part.match(/^[A-Z]+$/)) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return formattedParts.join(' ');
  }

  return (
    <span className="function-name">{formatCamelCaseToWords(name)}</span>
  );
}
