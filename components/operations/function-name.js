
export function FunctionName({name}) {

  const formatCamelCaseToWords = (str) => {
    const regex = /([A-Za-z][a-z]*)/g;
    const parts = str.match(regex);

    if (parts.length === 1) {
      return parts[0];
    }

    return parts.join(' ');
  }

  return (
    <span className="function-name">{formatCamelCaseToWords(name)}</span>
  );
}
