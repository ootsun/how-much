export function Logo({url, alt}) {

  return (
      <img
        src={url}
        alt={alt}
        className="inline w-5 h-5 relative inline-block"/>
  );
}
