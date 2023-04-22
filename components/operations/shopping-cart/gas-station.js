import {BiGasPump} from "react-icons/all.js";
import {ethers} from "ethers";
import {useContext, useEffect, useState} from "react";
import {BLOCK_INTERVAL_IN_MS} from "../../../lib/ethereum/ethereumUtils.js";
import {blockCountdownContext, currentPricesContext} from "../../../pages/_app.js";

export function GasStation() {

  const [progress, setProgress] = useState(0);
  const prices = useContext(currentPricesContext);
  const blockCountdown = useContext(blockCountdownContext);

  useEffect(() => {
    setProgress(BLOCK_INTERVAL_IN_MS - blockCountdown)
  }, [blockCountdown]);

  // set progress to BLOCK_INTERVAL_IN_MS (= full) when prices are updated
  useEffect(() => {
    setProgress(BLOCK_INTERVAL_IN_MS);
  }, [prices]);

  if (!prices?.gasPriceInWei) return null;
  const gweiAmount = Math.round(ethers.utils.formatUnits(prices.gasPriceInWei, 'gwei'));

  const radius = 15;
  const stroke = 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress / BLOCK_INTERVAL_IN_MS * circumference;

  return (
    <span className="relative mr-6">
      <BiGasPump className="w-8 h-8"/>
      <svg
        className="absolute top-3 left-5 z-10"
        height={radius * 2}
        width={radius * 2}>
        <circle
          id="gasPriceUpdateCircle"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{strokeDashoffset}}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="gwei-amount-gas-station">
        <span>{gweiAmount}</span>
      </span>
    </span>
  );
}
