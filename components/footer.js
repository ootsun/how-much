import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="flex justify-center items-center h-max lg:h-12">
      <p className="text-center">Feedback, suggestion or bug report?
        <a href="https://twitter.com/Oo_Tsun" target="_blank" rel="noreferrer" className="ml-2 align-middle">
          <Image
            src="/twitter.svg"
            alt="Twitter"
            className="inline"
            width={24}
            height={24}
          />
        </a>
        <a href="https://github.com/ootsun/how-much" target="_blank" rel="noreferrer" className="ml-2 align-middle">
          <Image
            src="/github.svg"
            alt="Github"
            className="inline"
            width={24}
            height={24}
          />
        </a>
      </p>
    </footer>
  );
}
