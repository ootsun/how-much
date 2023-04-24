import {Modal} from "flowbite-react";

export default function ActionModal({title, message, setMessage, callback}) {

  function handleClose(res) {
    callback(res);
    setMessage(null);
  }

  return (
    <Modal
      show={message !== null}>
      <Modal.Header>
        {title}
      </Modal.Header>
      <Modal.Body>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-row-reverse py-3 rounded-b">
          <button onClick={() => handleClose(true)} type="button" className="button">Confirm</button>
          <button onClick={() => handleClose(false)} type="button" className="button secondary-button mr-4">Cancel</button>
        </div>
      </Modal.Footer>
    </Modal>
    // <div id={customId} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0">
    //   <div className="relative px-4 w-full max-w-2xl h-full md:h-auto flex justify-center items-center">
    //     <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 px-6">
    //       <div className="flex justify-between items-start py-3 rounded-t">
    //         <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
    //           {title}
    //         </h3>
    //       </div>
    //       <div className="py-3">
    //         <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    //           {message}
    //         </p>
    //       </div>
    //       <div className="flex flex-row-reverse py-3 rounded-b">
    //         <button onClick={() => handleClose(true)} type="button" className="button">Confirm</button>
    //         <button onClick={() => handleClose(false)} type="button" className="button secondary-button mr-4">Cancel</button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
  }
