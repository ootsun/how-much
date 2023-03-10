import Image from "next/image.js";
import {Alert} from "flowbite-react";
import {HiInformationCircle} from "react-icons/all";
import {useState} from "react";

export function ReadOnlyAlert() {

  const [show, setShow] = useState(true);

  const onDismiss = () => {
    setShow(false);
  }

  return (
    show && <Alert
      additionalContent={<>
        <div className="mt-2 mb-4 text-sm text-blue-700 dark:text-blue-800">
          If I see some interest, I&apos;ll implement a collaborative edition mechanism. In the meantime, please reach out to ask new protocols support, propose new features or report bugs &#128578;
        </div>
        <div className="flex flex-row-reverse">
          <a href="https://github.com/ootsun/how-much/issues/new" target="_blank" rel="noreferrer" className="button small-button">
            <Image
              src="/github.svg"
              alt="Github"
              className="inline"
              width={24}
              height={24}
            />
            <span className="ml-2">Open an issue</span>
          </a>
        </div>
      </>}
      icon={HiInformationCircle}
      onDismiss={onDismiss}
      rounded={true}
      theme={{color: {cyan: '100'}}}>
      <h3 className="text-lg font-medium text-blue-700 dark:text-blue-800">
        Read only - still in beta
      </h3>
    </Alert>
  );
}
