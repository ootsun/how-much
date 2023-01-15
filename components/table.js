import {GlobalFilter} from './forms/global-filter.js';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/outline';
import {useEffect, useState} from "react";
import {useMobileDisplayHook} from "../lib/client/hooks/useMobileDisplayHook.js";

export function Table({
                        tableInstance,
                        filterPlaceholder,
                        readonlyMode,
                        setSelected,
                        searchCriteria,
                        setSearchCriteria
                      }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    gotoPage,
    pageCount,
    prepareRow,
    state,
    columns
  } = tableInstance;

  const {pageIndex} = state;

  const [lessNavButtons, setLessNavButtons] = useState(true);
  const isMobileDisplay = useMobileDisplayHook();
  useEffect(() => setLessNavButtons(isMobileDisplay), [isMobileDisplay]);

  useEffect(() => {
    gotoPage(searchCriteria?.pageIndex || 0);
  }, [searchCriteria]);

  const navigate = (pageNumber) => {
    setSearchCriteria({
      pageIndex: pageNumber,
      keyword: searchCriteria?.keyword || null
    });
  }

  const pageMustBeDisplayed = (pageToDisplay) => {
    return !lessNavButtons ?
      //Display 1 -> 5 if pageIndex <= 2 (pageToDisplay starts at 0)
      (pageIndex <= 2 && pageToDisplay <= 4)
      //Display pageIndex - 2, pageIndex - 1, pageIndex, pageIndex + 1 and pageIndex + 2
      || (pageToDisplay >= pageIndex - 2 && pageToDisplay <= pageIndex + 2)
      //Display pageCount - 4 -> pageCount if pageIndex >= pageCount - 2
      || (pageIndex >= pageCount - 2 && pageToDisplay >= pageCount - 5) :
      (pageIndex <= 1 && pageToDisplay <= 2)
      || (pageToDisplay >= pageIndex - 1 && pageToDisplay <= pageIndex + 1)
      || (pageIndex >= pageCount - 1 && pageToDisplay >= pageCount - 3)
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle dark:bg-gray-800">
        <div className="mb-4">
          <GlobalFilter searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria}
                        placeholder={filterPlaceholder}/>
        </div>
        <div className="overflow-hidden">
          <table {...getTableProps()}
                 className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
            {!readonlyMode && <thead className="bg-gray-100 dark:bg-gray-700">
            {
              headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={`trheaderGroups-${index}`}>
                  {
                    headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps ? column.getSortByToggleProps() : [])}
                          key={column.id}
                          className={`py-1 px-2 md:py-3 md:px-6 font-medium text-left w-1/${headerGroups.length}`}>
                        {column.render('Header')}{column.isSorted ? column.isSortedDesc ?
                        <span>
                            <svg className="w-3 h-3 inline ml-1 text-orange-500" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                            </svg>
                          </span> :
                        <span>
                            <svg className="w-3 h-3 inline ml-1 text-orange-500" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                            </svg>
                          </span> : ''}
                      </th>
                    ))}
                </tr>
              ))}
            </thead>
            }
            <tbody {...getTableBodyProps()}
                   className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {
              (page.length > 0 && page.map((row, index) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}
                      className={`${readonlyMode ? 'cursor-pointer' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      key={`trrow-${index}`} onClick={readonlyMode ? () => setSelected(row.original) : null}>
                    {
                      row.cells.map((cell, index) => {
                        return (
                          <td {...cell.getCellProps()}
                              key={`tdcell-${index}`}
                              className={`py-2 ${index === 0 ? 'pl-0' : ''} px-3 md:py-4 md:px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white`}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                  </tr>
                )
              }))
              ||
              <tr>
                <td colSpan={columns.length} className="py-2 px-4 text-gray-700 text-center">
                  Nothing found
                </td>
              </tr>
            }
            </tbody>
          </table>
        </div>
        <nav aria-label="Page navigation" className="flex justify-center m-1">
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button disabled={!canPreviousPage} onClick={() => navigate(0)}
                      className="page-arrow-button page-arrow-button-previous">
                <span className="sr-only">First page</span>
                <ChevronDoubleLeftIcon className="h-4 w-4"/>
              </button>
            </li>
            <li>
              <button disabled={!canPreviousPage} onClick={() => navigate(pageIndex - 1)}
                      className="page-arrow-button">
                <span className="sr-only">Previous page</span>
                <ChevronLeftIcon className="h-4 w-4"/>
              </button>
            </li>
            {
              [...Array(pageCount)]
                .map((x, index) => {
                    if (pageMustBeDisplayed(index)) {
                      return <li key={`lipageCount-${index}`}>
                        <button disabled={pageIndex === index} onClick={() => navigate(index)}
                                className="py-1.5 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:text-orange-500 disabled:hover:dark:bg-gray-800 disabled:hover:bg-white">
                          {index + 1}
                        </button>
                      </li>
                    }
                  }
                )
            }
            <li>
              <button disabled={!canNextPage} onClick={() => navigate(pageIndex + 1)}
                      className="page-arrow-button">
                <span className="sr-only">Next page</span>
                <ChevronRightIcon className="h-4 w-4"/>
              </button>
            </li>
            <li>
              <button disabled={!canNextPage} onClick={() => navigate(pageCount - 1)}
                      className="page-arrow-button page-arrow-button-next">
                <span className="sr-only">Last page</span>
                <ChevronDoubleRightIcon className="h-4 w-4"/>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
