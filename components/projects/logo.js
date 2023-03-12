import Image from "next/image.js";
import {GiTwoCoins} from "react-icons/all.js";

export function Logo({url, alt, isERC20}) {

  return (
    <>
      <Image
        src={url}
        alt={alt}
        className={`${isERC20 ? 'absolute' : 'relative'} inline-block`}
        width={20}
        height={20}/>
      {isERC20 &&
      <span className="z-10 pt-3 pl-3" title="Is ERC20">
        <GiTwoCoins color={"gold"}/>
      </span>}
    </>
  );
}
