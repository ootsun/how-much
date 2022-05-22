import {GlobalFilter} from './forms/global-filter.js';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';

export function Table({tableInstance, filterPlaceholder, readonlyMode, setSelected}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    gotoPage,
    pageCount,
    prepareRow,
    setGlobalFilter,
    state,
    columns
  } = tableInstance;

  const {globalFilter, pageIndex} = state;

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle dark:bg-gray-800">
        <div className="mb-4">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder={filterPlaceholder}/>
        </div>
        <div className="overflow-hidden">
          <table {...getTableProps()}
                 className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
            {
              headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={`trheaderGroups-${index}`}>
                  {
                    headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}
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
                              className="py-2 px-3 md:py-4 md:px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
              <button disabled={!canPreviousPage} onClick={() => previousPage()}
                      className="page-arrow-button page-arrow-button-previous">
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-4 w-4"/>
              </button>
            </li>
            {
              [...Array(pageCount)].map((x, index) =>
                <li key={`lipageCount-${index}`}>
                  <button disabled={pageIndex === index} onClick={() => gotoPage(index)}
                          className="py-1.5 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:text-orange-500 disabled:hover:dark:bg-gray-800 disabled:hover:bg-white">
                    {index + 1}
                  </button>
                </li>
              )
            }
            <li>
              <button disabled={!canNextPage} onClick={() => nextPage()}
                      className="page-arrow-button page-arrow-button-next">
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-4 w-4"/>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
