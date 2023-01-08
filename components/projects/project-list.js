import {Logo} from './logo.js';
import {useEffect, useMemo, useState} from 'react';
import {deleteProject, findAll} from '../../lib/client/projectHandler.js';
import ErrorModal from '../modals/error-modal.js';
import {useTable, usePagination} from 'react-table';
import {Toast} from '../toast.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {Table} from '../table.js';
import {search} from "../../lib/client/projectHandler.js";

export function ProjectList({initialProjects, selectedProject, setSelectedProject, updateList, setUpdateList}) {

  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [projects, setProjects] = useState(initialProjects.docs);
  const [totalPages, setTotalPages] = useState(initialProjects.totalPages);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [projectBeingDeleted, setProjectBeingDeleted] = useState(null);

  useEffect(() => {
    const fetchNewPage = async () => {
      if (searchCriteria == null) {
        return;
      }
      const res = await search(searchCriteria);
      if (!res.ok) {
        setErrorModalMessage(ERROR_MESSAGES.serverSide);
        toggleModal('projectListErrorModal');
        return;
      }
      const searchResult = await res.json();
      setProjects(searchResult.docs);
      setTotalPages(searchResult.totalPages);
    }
    fetchNewPage();
  }, [searchCriteria]);

  const data = useMemo(
    () => projects,
    [projects]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Logo',
        Cell: ({row}) => <Logo url={row.original.logoUrl} alt={row.original.name}/>,
        accessor: 'project.logoUrl',
        disableSortBy: true,
        disableGlobalFilter: true
      },
      {
        Cell: ({row}) => {
          return (
            <div className="flex flex-row-reverse">
              {projectBeingDeleted !== row.original &&
                <>
                  <span onClick={async () => await onDelete(row.original)}
                        className={`text-cyan-500 ${selectedProject !== row.original ? 'hover:underline cursor-pointer' : 'cursor-not-allowed'} ml-2`}>Delete</span>
                  <span onClick={() => setSelectedProject(row.original)}
                        className="text-cyan-500 hover:underline cursor-pointer">Edit</span>
                </>
              }
              {projectBeingDeleted === row.original && <LoadingCircle color={true}/>}
            </div>
          )
        },
        id: () => 'actions',
        accessor: 'actions',
        disableSortBy: true
      }
    ],
    [projectBeingDeleted]
  );

  const tableInstance = useTable({
      columns,
      data,
      manualPagination: true,
      pageCount: totalPages,
      initialState: {
        pageIndex: searchCriteria?.pageIndex || 0
      }
    },
    usePagination);

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

  useEffect(() => {
    const init = async () => {
      if (updateList) {
        await refreshList();
        setUpdateList(false);
      }
    }
    init();
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
    <>
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <ErrorModal message={errorModalMessage} customId="projectListErrorModal"/>
      <Table tableInstance={tableInstance}
             filterPlaceholder={'Search for projects'}
             readonlyMode={false}
             setSelected={setSelectedProject}
             searchCriteria={searchCriteria}
             setSearchCriteria={setSearchCriteria}/>
    </>
  );
}
