import {useEffect, useState} from "react";
import Image from "next/image.js";

export default function WelcomeBanner() {

  const LOCAL_STORAGE_SHOW_KEY = 'welcome-banner-show';

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShow(localStorage.getItem(LOCAL_STORAGE_SHOW_KEY) === null);
    }
  }, [show]);

  const close = () => {
    localStorage.setItem(LOCAL_STORAGE_SHOW_KEY, 'false');
    setShow(false);
  }

  return (
    <div
      className={`${show ? '' : 'hidden'} welcome-banner-wrapper bg-white shadow-xl w-max max-w-full fixed z-10 bottom-10 left-1/2 -translate-x-1/2 px-2 py-3 rounded-lg border dark:bg-gray-800`}>
      <p className="mr-10">Hi&nbsp;<span
        className="text-primary font-bold">{process.env.NEXT_PUBLIC_WELCOME_BANNER_TARGET}</span>!
        &nbsp;Be aware, as this tool is very recent, it may still have bugs. Please report them on Github! An operation is missing? Reach out! :)
        <a href="https://github.com/ootsun/how-much" target="_blank" rel="noreferrer" className="ml-2 align-bottom">
          <Image
            src="/github.svg"
            alt="Github"
            className="inline"
            width={24}
            height={24}
          />
        </a>
      </p>
      <button type="button"
              className="m-2 fixed right-0 top-0 bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={close} aria-label="Close">
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
}
