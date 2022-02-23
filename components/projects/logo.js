import Image from 'next/image';

export function Logo({url, alt}) {

  return (
    <div className="w-5 h-5 relative">
      <Image
        src={url}
        alt={alt}
        className="inline"
        layout='fill'
        objectFit='contain'
      />
    </div>
  );
}
