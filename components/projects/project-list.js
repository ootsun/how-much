import {Logo} from './logo.js';
import {useEffect, useMemo, useState} from 'react';
import {deleteProject, findAll} from '../../lib/client/projectHandler.js';
import ErrorModal from '../modals/error-modal.js';
import {useTable, useSortBy, useGlobalFilter, usePagination} from 'react-table';
import {GlobalFilter} from '../forms/global-filter.js';
import {Toast} from '../toast.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';

export function ProjectList({projects, selectedProject, setSelectedProject, updateList, setUpdateList}) {

  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [projectBeingDeleted, setProjectBeingDeleted] = useState(null);

  useEffect(() => {
    setAllProjects(projects);
  }, []);

  const data = useMemo(
    () => allProjects,
    [allProjects]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Logo',
        accessor: (project) =>
          <Logo url={project.logoUrl} alt={project.name}/>,
        disableSortBy: true
      },
      {
        id: () => 'actions',
        accessor: (project) => {
          return (
            <div className="flex flex-row-reverse">
              {projectBeingDeleted !== project &&
                <>
                  <span onClick={async () => await onDelete(project)}
                        className={`text-cyan-500 ${selectedProject !== project ? 'hover:underline cursor-pointer' : 'cursor-not-allowed'} ml-2`}>Delete</span>
                  <span onClick={() => setSelectedProject(project)}
                        className="text-cyan-500 hover:underline cursor-pointer">Edit</span>
                </>
              }
              {projectBeingDeleted === project && <LoadingCircle color={true}/>}
            </div>
          )
        },
        disableSortBy: true
      }
    ],
    [projectBeingDeleted]
  );

  const tableInstance = useTable({
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'name',
            desc: false
          }
        ]
      }
    },
    useGlobalFilter,
    useSortBy,
    usePagination);

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
    state,
    setGlobalFilter
  } = tableInstance;

  const {globalFilter, pageIndex} = state;

  async function refreshList() {
    try {
      const res = await findAll();
      if (!res.ok) {
        setErrorModalMessage('A server side error occurred. We could not load the projects.');
        toggleModal('projectListErrorModal');
        return;
      }
      setAllProjects(await res.json());
    } catch (e) {
      setErrorModalMessage('An error occurred. We could not load the projects. Check you internet connectivity.');
      toggleModal('projectListErrorModal');
    }
  }

  useEffect(async () => {
    if (updateList) {
      await refreshList();
      setUpdateList(false);
    }
  }, [updateList]);

  async function onDelete(project) {
    if (selectedProject !== project) {
      setProjectBeingDeleted(project);
      try {
        const res = await deleteProject(project._id);
        if (!res.ok) {
          setErrorModalMessage(ERROR_MESSAGES.serverSide);
          toggleModal('projectListErrorModal');
          await refreshList();
          setProjectBeingDeleted(null);
          return;
        }
        setToastMessage('Project successfully deleted');
        await refreshList();
        setProjectBeingDeleted(null);
      } catch (e) {
        setErrorModalMessage(ERROR_MESSAGES.connection);
        toggleModal('projectFormErrorModal');
        setProjectBeingDeleted(null);
      }
    }
  }

  return (
    <div className="flex flex-col">
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <ErrorModal message={errorModalMessage} customId="projectListErrorModal"/>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle dark:bg-gray-800">
          <div className="mb-4">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
          </div>
          <div className="overflow-hidden">
            <table {...getTableProps()}
                   className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
              {
                headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {
                      headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}
                            className="py-3 px-6 font-medium tracking-wider text-left text-gray-700 dark:text-gray-400 w-1/3">
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
                page.map(row => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      {
                        row.cells.map(cell => {
                          return (
                            <td {...cell.getCellProps()}
                                className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {cell.render('Cell')}
                            </td>
                          )
                        })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <nav aria-label="Page navigation" className="flex justify-center m-1">
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button disabled={!canPreviousPage} onClick={() => previousPage()}
                        className="page-arrow-button page-arrow-button-previous">
                  <span className="sr-only">Previous</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"></path>
                  </svg>
                </button>
              </li>
              {
                [...Array(pageCount)].map((x, i) =>
                  <li>
                    <button disabled={pageIndex === i} onClick={() => gotoPage(i)}
                            className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:text-orange-500 disabled:hover:dark:bg-gray-800 disabled:hover:bg-white">
                      {i + 1}
                    </button>
                  </li>
                )
              }
              <li>
                <button disabled={!canNextPage} onClick={() => nextPage()}
                        className="page-arrow-button page-arrow-button-next">
                  <span className="sr-only">Next</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"></path>
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
