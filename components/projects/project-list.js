import {Logo} from './logo.js';
import {useEffect, useMemo, useState} from 'react';
import {deleteProject, findAll} from '../../lib/client/projectHandler.js';
import ErrorModal from '../modals/error-modal.js';
import {useTable, useSortBy, useGlobalFilter, usePagination} from 'react-table';
import {Toast} from '../toast.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {Table} from '../table.js';

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
      <Table tableInstance={tableInstance}/>
    </div>
  );
}
