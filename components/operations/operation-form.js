import {Controller, useForm} from 'react-hook-form';
import {LoadingCircle} from '../loading-circle.js';
import {useEffect, useState, Fragment, useContext} from 'react';
import ErrorModal from '../modals/error-modal.js';
import {Toast} from '../toast.js';
import ActionModal from '../modals/action-modal.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {Combobox, Transition} from '@headlessui/react';
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid';
import {create, update} from '../../lib/client/operationHandler.js';
import {ProjectNameLogo} from '../projects/project-name-logo.js';
import {search as searchProject} from "../../lib/client/projectHandler.js";
import {search} from "../../lib/client/operationHandler.js";
import {editorContext} from "../../pages/_app.js";

export function OperationForm({initialProjects, selectedOperation, setSelectedOperation, setUpdateList}) {
  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [actionModalTitle, setActionModalTitle] = useState(null);
  const [actionModalMessage, setActionModalMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [previousSelectedOperation, setPreviousSelectedOperation] = useState(null);
  const [keyword, setKeyword] = useState(' ');
  const [functionNames, setFunctionNames] = useState([]);

  const [projects, setProjects] = useState(initialProjects.docs);
  const [totalDocs, setTotalDocs] = useState(initialProjects.totalDocs);

  const {register, handleSubmit, formState, reset, setValue, watch, control, trigger} = useForm({
    mode: 'onTouched'
  });
  let {isSubmitting, errors, isValid, isDirty} = formState;
  const watchFunctionName = watch('functionName', null);
  const watchContractAddress = watch('contractAddress', null);
  const watchProject = watch('project', null);
  console.log('watchProject', watchProject)

  const {canEdit} = useContext(editorContext);

  useEffect(() => {
    const fetchNewPage = async () => {
      if (!keyword) {
        setProjects(initialProjects.docs);
        setTotalDocs(initialProjects.totalDocs);
      } else {
        const res = await searchProject({pageIndex: 0, keyword});
        if (!res.ok) {
          setErrorModalMessage(ERROR_MESSAGES.serverSide);
          toggleModal('operationFormErrorModal');
          return;
        }
        const searchResult = await res.json();
        setProjects(searchResult.docs);
        setTotalDocs(searchResult.totalDocs);
      }
    }
    fetchNewPage();
  }, [keyword]);

  async function replaceFormValues() {
    reset();
    setValue('project', selectedOperation.project);
    setValue('functionName', selectedOperation.functionName);
    setValue('contractAddress', selectedOperation.contractAddress);
    setValue('version', selectedOperation.version);
    setValue('isERC20', selectedOperation.isERC20);
    setPreviousSelectedOperation(selectedOperation);
    await loadFunctionNames(selectedOperation.project);
  }

  async function handleActionModalResponse(res) {
    if (res) {
      await replaceFormValues();
    } else {
      setSelectedOperation(previousSelectedOperation);
    }
  }

  useEffect(() => {
    const init = async () => {
      if (selectedOperation && selectedOperation !== previousSelectedOperation) {
        if (isDirty) {
          setActionModalTitle('Warning');
          setActionModalMessage('A operation is already in the process of being created or edited. Are you sure you want to overwrite the changes?')
          toggleModal('operationFormActionModal');
        } else {
          await replaceFormValues();
        }
      }
    }
    init();
  }, [selectedOperation]);

  async function createOperation(form) {
    const res = await create(form.project, form.functionName, form.contractAddress, form.version, form.isERC20);
    // if (!res.ok) {
    //   if (res.status === 400) {
    //     setErrorModalMessage(ERROR_MESSAGES.invalidOperation);
    //   } else {
    //     setErrorModalMessage(ERROR_MESSAGES.serverSide);
    //   }
    //   toggleModal('operationFormErrorModal');
    //   return false;
    // }
    setToastMessage('Operation successfully created');
    return true;
  }

  async function updateOperation(form) {
    const res = await update(selectedOperation._id, form.project, form.functionName, form.contractAddress, form.version, form.isERC20);
    if (!res.ok) {
      setErrorModalMessage(ERROR_MESSAGES.serverSide);
      toggleModal('operationFormErrorModal');
      return false;
    }
    setSelectedOperation(null);
    setPreviousSelectedOperation(null);
    setToastMessage('Operation successfully updated');
    return true;
  }

  async function onSubmit(form) {
    try {
      let res;
      if (selectedOperation) {
        res = await updateOperation(form);
      } else {
        res = await createOperation(form);
      }
      if (res) {
        setUpdateList(true);
        reset();
        setValue('project', form.project);
        setValue('contractAddress', form.contractAddress);
        setValue('version', form.version);
        setValue('isERC20', form.isERC20);
      }
    } catch (e) {
      setErrorModalMessage(ERROR_MESSAGES.connection);
      toggleModal('operationFormErrorModal');
    }
  }

  function onCancel() {
    setSelectedOperation(null);
    setPreviousSelectedOperation(null);
    reset();
  }

  function functionNameIsUnique(value) {
    if (!functionNames.length || !watchFunctionName || !watchContractAddress) {
      return true;
    }

    if (functionNames.some(operation => operation.functionName.toLowerCase() === value.trim().toLowerCase()
      && operation.contractAddress.trim().toLowerCase() === watchContractAddress.toLowerCase()
      && (!selectedOperation || operation._id !== selectedOperation._id))) {
      return ERROR_MESSAGES.operationAlreadyExists;
    }

    return true;
  }

  const onProjectChange = (project) => {
    loadFunctionNames(project);
    setValue('project', project);
  }

  const loadFunctionNames = async (project) => {
    const res = await search({projectId: project._id});
    if (!res.ok) {
      setErrorModalMessage(ERROR_MESSAGES.serverSide);
      toggleModal('operationFormErrorModal');
      return;
    }
    setFunctionNames(await res.json());
    await trigger('functionName');
  }

  return (
    <>
      <ActionModal title={actionModalTitle} message={actionModalMessage} callback={handleActionModalResponse}
                   customId="operationFormActionModal"/>
      <ErrorModal message={errorModalMessage} customId="operationFormErrorModal"/>
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input autoComplete="false" name="hidden" type="text" className="hidden"/>
        <div className="grid sm:grid-cols-5 sm:gap-4 mb-3">
          <div className="relative mb-3 md:mb-0 w-full z-10">
            <Controller
              render={({ field: { onChange, onBlur, value, name, ref }}) => {

                console.log('rendering project combobox', value)
                return <Combobox value={value} onChange={onProjectChange} disabled={!canEdit}>
              <div
                className="relative z-0">
                  <Combobox.Input
                name={name}
                onBlur={onBlur}
                ref={ref}
                className="input peer pr-10"
                onChange={(e) => {setKeyword(e.target.value);onChange(e);}}
                displayValue={(project) => project ? project.name : ''}
                placeholder=" "
                  />
                  <Combobox.Label htmlFor="project"
                className="label peer-focus:left-0 peer-focus:text-primary-d peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Project</Combobox.Label>
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setKeyword('')}
                >
                  <Combobox.Options
                    className="bg-white border-gray-300 border rounded w-full mt-2 max-h-40 overflow-y-scroll cursor-pointer absolute py-1 mt-1 overflow-auto text-base">
                    {projects.length === 0 ? (
                      <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      [...projects.map((project) => (
                        <Combobox.Option
                          key={project._id}
                          className={({active}) =>
                            `h-9 hover:bg-gray-100 cursor-default select-none relative py-2 pl-10 pr-4 ${active ? 'bg-gray-100' : ''}`
                          }
                          value={project}>
                          {({selected}) => (
                            <>
                                <span className="block truncate">
                                  <ProjectNameLogo project={project}/>
                                </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                      <CheckIcon className="w-5 h-5" aria-hidden="true"/>
                                  </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      )), ...[totalDocs > 10 ?
                        <div className="cursor-default select-none relative py-2 pl-10 pr-4 text-gray-700"
                             key="more-items">
                          {totalDocs - 10} more projects...
                        </div> : null]
                      ]
                    )}
                  </Combobox.Options>
                </Transition>
              </Combobox>
              }

              }
              control={control}
              name="project"
              // value={watchProject}
              rules={{required: 'Mandatory field'}}/>
            {errors.project && <span className="error">{errors.project.message}</span>}
          </div>
          <div className="relative mb-3 md:mb-0 w-full z-0">
            <input type="text"
                   className="input peer"
                   placeholder=" "
                   {...register('version')}
                   disabled={!canEdit}/>
            <label htmlFor="version"
                   className="label peer-focus:left-0 peer-focus:text-primary-d peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Version</label>
          </div>
          <div className="relative mb-3 md:mb-0 w-full z-0 flex items-center">
            <input id="isERC20" type="checkbox"
                   {...register('isERC20')}
                   disabled={!canEdit}
                   className="w-4 h-4 text-primary-d bg-gray-100 border-gray-300 rounded focus:text-primary dark:focus:text-primary-d dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
            <label htmlFor="isERC20"
                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is ERC20</label>
          </div>
          <div className="relative mb-3 md:mb-0 w-full z-0">
            <input type="text"
                   className="input peer"
                   placeholder=" "
                   {...register('functionName', {required: 'Mandatory field', validate: functionNameIsUnique})}
                   disabled={!canEdit}/>
            <label htmlFor="functionName"
                   className="label peer-focus:left-0 peer-focus:text-primary-d peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Function name</label>
            {errors.functionName && <span className="error">{errors.functionName.message}</span>}
          </div>
          <div className="relative mb-3 md:mb-0 w-full z-0">
            <input type="text"
                   className="input peer"
                   placeholder=" "
                   {...register('contractAddress', {validate: functionNameIsUnique})}
                   disabled={!canEdit}/>
            <label htmlFor="contractAddress"
                   className="label peer-focus:left-0 peer-focus:text-primary-d peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Contract address</label>
            {errors.contractAddress && <span className="error">{errors.contractAddress.message}</span>}
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button type="submit"
                  className="button"
                  disabled={isSubmitting || !isValid || !isDirty || !canEdit}>
            {isSubmitting && <LoadingCircle/>}
            {selectedOperation ? 'Edit' : 'Create'}
          </button>
          <button type="button"
                  className={`button secondary-button mr-4 ${selectedOperation ? '' : 'hidden'}`}
                  disabled={isSubmitting || !canEdit}
                  onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
