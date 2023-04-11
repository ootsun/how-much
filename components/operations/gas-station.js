import {BiGasPump} from "react-icons/all.js";
import {useGasAndEthPricesHook} from "../../lib/client/hooks/use-gas-and-eth-prices-hook.js";
import {ethers} from "ethers";

export function GasStation() {

  const prices = useGasAndEthPricesHook();

  if(!prices?.gasPriceInWei) return null;

  const gweiAmount = Math.round(ethers.utils.formatUnits(prices.gasPriceInWei, 'gwei'));

  return (
    <div className="relative">
      <BiGasPump className="w-8 h-8"/>
      <span className="absolute top-4 left-4 bg-white/70 rounded-full p-1 text-xs font-bold">{gweiAmount}</span>
    </div>
  );
}
