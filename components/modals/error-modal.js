import { Modal } from 'flowbite-react'

export function ErrorModal({message, setMessage}) {

  const title = "Error";

  function handleClose() {
    setMessage(null);
  }

  return (
    <Modal
      show={message !== null}
      onClose={handleClose}>
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
          <button onClick={handleClose} type="button" className="button">Close</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
