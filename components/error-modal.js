export default function ErrorModal({modalMessage}) {

  const title = "Error";

  function handleClose() {
    toggleModal('errorModal', false);
  }

  return (
    <div id="errorModal" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0">
      <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 px-6">
          <div className="flex justify-between items-start py-3 rounded-t">
            <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
              {title}
            </h3>
          </div>
          <div className="py-3">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {modalMessage}
            </p>
          </div>
          <div className="flex flex-row-reverse py-3 rounded-b">
            <button onClick={handleClose} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
  }