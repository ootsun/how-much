import formatThousands from 'format-thousands';

export function roundPrice(price) {
  const result = Math.round(price * 100) / 100;
  const resultString = result + '';
  const tokens = resultString.split('.');
  if(tokens.length === 2 && tokens[1].length === 1) {
    return formatThousands(result) + '0';
  }
  return formatThousands(result);
}
