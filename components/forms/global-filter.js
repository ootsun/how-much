import {SearchIcon} from '@heroicons/react/outline';
import {DebounceInput} from "react-debounce-input";

export function GlobalFilter({searchCriteria, setSearchCriteria, placeholder}) {

  const search = (e) => {
    setSearchCriteria({
      pageIndex: 0,
      keyword: e.target.value
    });
  }

  return (
    <>
      <label htmlFor="table-search" className="sr-only">Search</label>
      <div className="relative mt-1">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
        </div>
        <DebounceInput type="text" id="table-search"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder={placeholder}
                       value={searchCriteria?.keyword || ''}
                       debounceTimeout={300}
                       onChange={search}/>
      </div>
    </>
  );
}
