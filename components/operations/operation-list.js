import {useContext, useEffect, useMemo, useState} from 'react';
import {deleteOperation, search} from '../../lib/client/operationHandler.js';
import {ErrorModal} from '../modals/error-modal.js';
import {useTable, usePagination} from 'react-table';
import {Toast} from '../toast.js';
import {LoadingCircle} from '../loading-circle.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {ProjectNameLogo} from '../projects/project-name-logo.js';
import {ContractAddress} from './contract-address.js';
import {Table} from "../table.js";
import {Skeleton} from "../skeleton.js";
import {useMobileDisplayHook} from "../../lib/client/hooks/use-mobile-display-hook.js";
import {editorContext} from "../../pages/_app.js";
import {FunctionName} from "./function-name.js";

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
  const [loading, setLoading] = useState(false);

  const isMobileDisplay = useMobileDisplayHook();

  const {canEdit} = useContext(editorContext);

  useEffect(() => {setDisplayContractAddress(!isMobileDisplay)}, [isMobileDisplay]);

  useEffect(() => {
    const fetchNewPage = async () => {
      if (searchCriteria == null) {
        return;
      }
      searchCriteria.havingLastGasUsage = havingLastGasUsage;
      setLoading(true);
      const res = await search(searchCriteria);
      setLoading(false);
      if (!res.ok) {
        setErrorModalMessage(ERROR_MESSAGES.serverSide);
        return;
      }
      const searchResult = await res.json();
      setOperations(searchResult.docs);
      setTotalPages(searchResult.totalPages);
    }
    fetchNewPage();
  }, [searchCriteria]);

  const data = useMemo(
    () => (loading ? Array(10).fill({}) : operations),
    [operations, loading]
  );

  const columns = useMemo(
    () => createColumns(),
    [operationBeingDeleted, loading, displayContractAddress]
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
        Header: readonlyMode ? '' : 'Project',
        Cell: ({row}) => <ProjectNameLogo operation={row.original} project={row.original.project} loading={loading} short={false}/>,
        accessor: 'project.name',
        id: 'project.name'
      },
      {
        Header: readonlyMode ? '' : 'Function name',
        Cell: ({row}) =>
          loading ?
            <Skeleton functionName={true}/> :
            <FunctionName name={row.original.functionName}/>,
        accessor: 'functionName',
        id: 'functionName',
      }
    ];

    if (displayContractAddress) {
      columns.push({
        Header: readonlyMode ? '' : 'Contract address',
        Cell: ({row}) => loading ?
          <Skeleton contractAddress={true}/> :
          <ContractAddress address={row.original.contractAddress}/>,
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
                        className={`${selectedOperation !== operation && canEdit ? 'text-cyan-500 hover:underline cursor-pointer' : 'text-gray-500 cursor-not-allowed'} ml-2`}>Delete</span>
                <span onClick={() => setSelectedOperation(operation)}
                      className={`${canEdit ? 'text-cyan-500 hover:underline cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}>Edit</span>
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
    setSearchCriteria({
      pageIndex: searchCriteria?.pageIndex || 0,
      keyword: searchCriteria?.keyword
    });
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
          await refreshList();
          setOperationBeingDeleted(null);
          return;
        }
        setToastMessage('Operation successfully deleted');
        await refreshList();
        setOperationBeingDeleted(null);
      } catch (e) {
        console.error(e)
        setErrorModalMessage(ERROR_MESSAGES.connection);
        setOperationBeingDeleted(null);
      }
    }
  }

  return (
    <>
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <ErrorModal message={errorModalMessage} setMessage={setErrorModalMessage}/>
      <Table tableInstance={tableInstance}
             filterPlaceholder={'Search for operations'}
             readonlyMode={readonlyMode}
             setSelected={setSelectedOperation}
             searchCriteria={searchCriteria}
             setSearchCriteria={setSearchCriteria}/>
    </>
  );
}
