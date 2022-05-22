import {useState} from 'react';
import {ClipboardCheckIcon} from '@heroicons/react/outline';

export function ClipboardToast({show, setShow}) {

  const [firstDisplay, setFirstDisplay] = useState(true);

  if(show && firstDisplay) {
    setFirstDisplay(false);
    setTimeout(() => {
      setShow(false);
      setFirstDisplay(true);
    }, 2000);
  }

  return (
    <div className="relative">
      <div id="clipboard-toast"
           className={`${show ? '' : 'hidden'} z-10 absolute bottom-7 left-11 flex items-center p-2 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`}
           role="alert">
        <div
          className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          <ClipboardCheckIcon className="w-5 h-5"/>
        </div>
        <div className="ml-3 text-sm font-normal">Copied</div>
      </div>
    </div>
  );
}
