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
  );
  }
