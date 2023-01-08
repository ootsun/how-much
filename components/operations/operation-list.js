import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js'
import {useEffect, useMemo, useState} from 'react';
import {deleteOperation, findAll, search} from '../../lib/client/operationHandler.js';
import ErrorModal from '../modals/error-modal.js';
import {useTable, usePagination} from 'react-table';
import {Toast} from '../toast.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {ProjectNameLogo} from '../projects/project-name-logo.js';
import {ContractAddress} from './contract-address.js';
import {Table} from "../table.js";

export function OperationList({
                                initialOperations,
                                selectedOperation,
                                setSelectedOperation,
                                updateList,
                                setUpdateList,
                                readonlyMode,
                                havingLastGasUsage
                              }) {

  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [operations, setOperations] = useState(initialOperations.docs);
  const [totalPages, setTotalPages] = useState(initialOperations.totalPages);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [displayContractAddress, setDisplayContractAddress] = useState(true);
  const [operationBeingDeleted, setOperationBeingDeleted] = useState(null);

  useEffect(() => {
    const fullConfig = resolveConfig(tailwindConfig);
    const smNumber = Number.parseInt(fullConfig.theme.screens.sm.replace('px', ''));
    setDisplayContractAddress(typeof window !== 'undefined' && window.innerWidth >= smNumber);
  }, []);

  useEffect(() => {
    const fetchNewPage = async () => {
      if (searchCriteria == null) {
        return;
      }
      searchCriteria.havingLastGasUsage = havingLastGasUsage;
      const res = await search(searchCriteria);
      if (!res.ok) {
        setErrorModalMessage(ERROR_MESSAGES.serverSide);
        toggleModal('operationListErrorModal');
        return;
      }
      const searchResult = await res.json();
      setOperations(searchResult.docs);
      setTotalPages(searchResult.totalPages);
    }
    fetchNewPage();
  }, [searchCriteria]);

  const data = useMemo(
    () => operations,
    [operations]
  );

  const columns = useMemo(
    () => createColumns(),
    [operationBeingDeleted]
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

  function createColumns() {
    const columns = [
      {
        Header: 'Project',
        Cell: ({row}) => <ProjectNameLogo project={row.original.project}/>,
        accessor: 'project.name',
        id: 'project.name'
      },
      {
        Header: 'Function name',
        Cell: ({row}) => <span className="function-name">{row.original.functionName}</span>,
        accessor: 'functionName',
        id: 'functionName',
      }
    ];

    if (displayContractAddress) {
      columns.push({
        Header: 'Contract address',
        Cell: ({row}) => <ContractAddress address={row.original.contractAddress}/>,
        accessor: 'contractAddress',
        id: 'contractAddress',
      });
    }

    if (!readonlyMode) {
      columns.push({
        id: 'actions',
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
      });
    }

    return columns;
  }

  async function refreshList() {
    try {
      const res = await findAll();
      if (!res.ok) {
        setErrorModalMessage('A server side error occurred. We could not load the operations.');
        toggleModal('operationListErrorModal');
        return;
      }
      setOperations(await res.json());
    } catch (e) {
      setErrorModalMessage('An error occurred. We could not load the operations. Check you internet connectivity.');
      toggleModal('operationListErrorModal');
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
    <>
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <ErrorModal message={errorModalMessage} customId="operationListErrorModal"/>
      <Table tableInstance={tableInstance}
             filterPlaceholder={'Search for operations'}
             readonlyMode={readonlyMode}
             setSelected={setSelectedOperation}
             searchCriteria={searchCriteria}
             setSearchCriteria={setSearchCriteria}/>
    </>
  );
}
