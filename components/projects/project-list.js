import {Logo} from './logo.js';
import {useContext, useEffect, useMemo, useState} from 'react';
import {deleteProject} from '../../lib/client/projectHandler.js';
import {ErrorModal} from '../modals/error-modal.js';
import {useTable, usePagination} from 'react-table';
import {Toast} from '../toast.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {Table} from '../table.js';
import {search} from "../../lib/client/projectHandler.js";
import {Skeleton} from "../skeleton.js";
import {editorContext} from "../../pages/_app.js";

export function ProjectList({initialProjects, selectedProject, setSelectedProject, updateList, setUpdateList}) {

  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [projects, setProjects] = useState(initialProjects.docs);
  const [totalPages, setTotalPages] = useState(initialProjects.totalPages);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [projectBeingDeleted, setProjectBeingDeleted] = useState(null);
  const [loading, setLoading] = useState(false);

  const {canEdit} = useContext(editorContext);

  useEffect(() => {
    fetchNewPage();
  }, [searchCriteria]);

  const data = useMemo(
    () => (loading ? Array(10).fill({}) : projects),
    [projects, loading]
  );

  const columns = useMemo(
    () => createColumns(),
    [projectBeingDeleted, loading]
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

  const fetchNewPage = async () => {
    if (searchCriteria == null) {
      return;
    }
    setLoading(true);
    const res = await search(searchCriteria);
    setLoading(false);
    if (!res.ok) {
      setErrorModalMessage(ERROR_MESSAGES.serverSide);
      return;
    }
    const searchResult = await res.json();
    setProjects(searchResult.docs);
    setTotalPages(searchResult.totalPages);
  }

  function createColumns() {
    return [
        {
          Header: 'Name',
          accessor: 'name',
          Cell: ({row}) =>
            loading ?
              <Skeleton/> :
              <span>{row.original.name}</span>,
        },
        {
          Header: 'Logo',
          Cell: ({row}) => loading ?
            <Skeleton logo={true}/> :
            <Logo url={row.original.logoUrl} alt={row.original.name} loading={loading}/>,
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
                        className={`${selectedProject !== row.original && canEdit ? 'text-secondary hover:underline cursor-pointer' : 'text-gray-500 cursor-not-allowed'} ml-2`}>Delete</span>
                  <span onClick={() => setSelectedProject(row.original)}
                        className={`${canEdit ? 'text-secondary hover:underline cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}>Edit</span>
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
      ];
  }

  async function refreshList() {
    setSearchCriteria({
      pageIndex: searchCriteria?.pageIndex || 0,
      keyword: searchCriteria?.keyword
    });
  }

  useEffect(() => {
    const init = async () => {
      if (updateList) {
        await fetchNewPage();
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
          await fetchNewPage();
          setProjectBeingDeleted(null);
          return;
        }
        setToastMessage('Project successfully deleted');
        await fetchNewPage();
        setProjectBeingDeleted(null);
      } catch (e) {
        setErrorModalMessage(ERROR_MESSAGES.connection);
        setProjectBeingDeleted(null);
      }
    }
  }

  return (
    <>
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <ErrorModal message={errorModalMessage} setMessage={setErrorModalMessage}/>
      <Table tableInstance={tableInstance}
             filterPlaceholder={'Search for projects'}
             readonlyMode={false}
             setSelected={setSelectedProject}
             searchCriteria={searchCriteria}
             setSearchCriteria={setSearchCriteria}/>
    </>
  );
}
