export function ProjectList() {

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle dark:bg-gray-800">
          <div className="p-4">
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative mt-1">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"></path>
                </svg>
              </div>
              <input type="text" id="table-search"
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="Search for projects"/>
            </div>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                  Name
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                  Logo
                </th>
                <th scope="col" className="relative py-3 px-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Ethereum
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">$1999</td>
                  <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                    <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Aave
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">$1999</td>
                  <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                    <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
