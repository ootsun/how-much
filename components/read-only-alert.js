import Image from "next/image.js";
import {Alert} from "flowbite-react";
import {HiInformationCircle} from "react-icons/all";

export function ReadOnlyAlert() {

  return (
    <Alert
      color="info"
      additionalContent={<>
        <div className="mt-2 mb-4 text-sm text-blue-700 dark:text-blue-800">
          If I see some interest, I'll implement a collaborative edition mechanism. In the meantime, please reach out to ask new protocols support, propose new features or report bugs.
        </div>
        <div className="flex">
          <a href="https://github.com/ootsun/how-much" target="_blank" rel="noreferrer" className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <Image
              src="/github.svg"
              alt="Github"
              className="inline"
              width={24}
              height={24}
            />
            <span className="ml-2">Open an issue</span>
          </a>
          <button type="button" className="rounded-lg border border-blue-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:ring-4 focus:ring-blue-300 dark:border-blue-800 dark:text-blue-800 dark:hover:text-white">Dismiss</button>
        </div>
      </>}
      icon={HiInformationCircle}>
      <h3 className="text-lg font-medium text-blue-700 dark:text-blue-800">
        Read only - still in beta
      </h3>
    </Alert>
  );
}
