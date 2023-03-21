import Image from "next/image.js";

export function Logo({url, alt}) {

  return (
    <>
      <Image
        src={url}
        alt={alt}
        className={`relative inline-block`}
        width={20}
        height={20}/>
    </>
  );
}
