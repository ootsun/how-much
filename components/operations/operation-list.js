import {useEffect, useMemo, useState} from 'react';
import {deleteOperation, findAll} from '../../lib/client/operationHandler.js';
import ErrorModal from '../modals/error-modal.js';
import {useTable, useSortBy, useGlobalFilter, usePagination} from 'react-table';
import {Toast} from '../toast.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {ProjectNameLogo} from '../projects/project-name-logo.js';
import {Table} from '../table.js';

export function OperationList({operations, selectedOperation, setSelectedOperation, updateList, setUpdateList}) {

  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [allOperations, setAllOperations] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [operationBeingDeleted, setOperationBeingDeleted] = useState(null);

  useEffect(() => {
    setAllOperations(operations);
  }, []);

  const data = useMemo(
    () => allOperations,
    [allOperations]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Project',
        accessor: (operation) => <ProjectNameLogo project={operation.project}/>,
      },
      {
        Header: 'Function name',
        accessor: 'functionName',
      },
      {
        Header: 'Contract address',
        accessor: 'contractAddress',
      },
      {
        id: () => 'actions',
        accessor: (operation) => {
          return (
            <div className="flex flex-row-reverse">
              {operationBeingDeleted !== operation &&
                <>
                  <span onClick={async () => await onDelete(operation)}
                        className={`text-cyan-500 ${selectedOperation !== operation ? 'hover:underline cursor-pointer' : 'cursor-not-allowed'} ml-2`}>Delete</span>
                  <span onClick={() => setSelectedOperation(operation)}
                        className="text-cyan-500 hover:underline cursor-pointer">Edit</span>
                </>
              }
              {operationBeingDeleted === operation && <LoadingCircle color={true}/>}
            </div>
          )
        },
        disableSortBy: true
      }
    ],
    [operationBeingDeleted]
  );

  const tableInstance = useTable({
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'project',
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
        setErrorModalMessage('A server side error occurred. We could not load the operations.');
        toggleModal('operationListErrorModal');
        return;
      }
      setAllOperations(await res.json());
    } catch (e) {
      setErrorModalMessage('An error occurred. We could not load the operations. Check you internet connectivity.');
      toggleModal('operationListErrorModal');
    }
  }

  useEffect(async () => {
    if (updateList) {
      await refreshList();
      setUpdateList(false);
    }
  }, [updateList]);

  async function onDelete(operation) {
    if (selectedOperation !== operation) {
      setOperationBeingDeleted(operation);
      try {
        const res = await deleteOperation(operation._id);
        if (!res.ok) {
          setErrorModalMessage(ERROR_MESSAGES.serverSide);
          toggleModal('operationListErrorModal');
          await refreshList();
          setOperationBeingDeleted(null);
          return;
        }
        setToastMessage('Operation successfully deleted');
        await refreshList();
        setOperationBeingDeleted(null);
      } catch (e) {
        setErrorModalMessage(ERROR_MESSAGES.connection);
        toggleModal('operationFormErrorModal');
        setOperationBeingDeleted(null);
      }
    }
  }

  return (
    <div className="flex flex-col">
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <ErrorModal message={errorModalMessage} customId="operationListErrorModal"/>
      <Table tableInstance={tableInstance}/>
    </div>
  );
}
