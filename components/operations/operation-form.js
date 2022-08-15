import {Controller, useForm} from 'react-hook-form';
import {LoadingCircle} from '../loading-circle.js';
import {useEffect, useState, Fragment} from 'react';
import ErrorModal from '../modals/error-modal.js';
import {Toast} from '../toast.js';
import ActionModal from '../modals/action-modal.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';
import {Combobox, Transition} from '@headlessui/react';
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid';
import {create, update} from '../../lib/client/operationHandler.js';
import {Logo} from '../projects/logo.js';
import {ProjectNameLogo} from '../projects/project-name-logo.js';

export function OperationForm({operations, projects, selectedOperation, setSelectedOperation, setUpdateList}) {
  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [actionModalTitle, setActionModalTitle] = useState(null);
  const [actionModalMessage, setActionModalMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [previousSelectedOperation, setPreviousSelectedOperation] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [query, setQuery] = useState(' ');

  const filteredProjects =
    query === '' || query === ' '
      ? projects
      : projects.filter((project) => {
        return project.name.toLowerCase().includes(query.toLowerCase())
      })

  const {register, handleSubmit, formState, reset, setValue, getValues, watch, control} = useForm({
    mode: 'onTouched'
  });
  let {isSubmitting, errors, isValid, isDirty} = formState;
  const watchProject = watch('project', null);

  async function replaceFormValues() {
    reset();
    setValue('project', selectedOperation.project);
    setValue('functionName', selectedOperation.functionName);
    setValue('contractAddress', selectedOperation.contractAddress);
    setPreviousSelectedOperation(selectedOperation);
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
    const res = await create(form.project, form.functionName, form.contractAddress);
    if (!res.ok) {
      if(res.status === 400) {
        setErrorModalMessage(ERROR_MESSAGES.invalidOperation);
      } else {
        setErrorModalMessage(ERROR_MESSAGES.serverSide);
      }
      toggleModal('operationFormErrorModal');
      return false;
    }
    setToastMessage('Operation successfully created');
    return true;
  }

  async function updateOperation(form) {
    const res = await update(selectedOperation._id, form.project, form.functionName, form.contractAddress);
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
    return true;
    // return ERROR_MESSAGES.operationAlreadyExists;
  }

  return (
    <>
      <ActionModal title={actionModalTitle} message={actionModalMessage} callback={handleActionModalResponse}
                   customId="operationFormActionModal"/>
      <ErrorModal message={errorModalMessage} customId="operationFormErrorModal"/>
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input autoComplete="false" name="hidden" type="text" className="hidden"/>
        <div className="grid sm:grid-cols-3 sm:gap-4 mb-3">
          <div className="relative mb-3 md:mb-0 w-full z-10">
            <Controller
              render={({field}) =>
                <Combobox value={getValues('project')} onChange={(project) => setValue('project', project)}>
                  <div
                    className="relative z-0">
                    <Combobox.Input
                      {...field}
                      className="input peer pr-10"
                      onChange={(event) => setQuery(event.target.value)}
                      displayValue={(project) => project ? project.name : ''}
                      placeholder=" "
                    />
                    <Combobox.Label htmlFor="project"
                                    className="label peer-focus:left-0 peer-focus:text-fuchsia-600 peer-focus:dark:text-fuchsia-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
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
                    afterLeave={() => setQuery('')}
                  >
                    <Combobox.Options
                      className="bg-white border-gray-300 border rounded w-full mt-2 max-h-40 overflow-y-scroll cursor-pointer absolute py-1 mt-1 overflow-auto text-base">
                      {filteredProjects.length === 0 && query !== '' && query !== ' ' ? (
                        <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                          Nothing found.
                        </div>
                      ) : (
                        filteredProjects.map((project) => (
                          <Combobox.Option
                            key={project._id}
                            className={({active}) =>
                              `h-9 hover:bg-cyan-50 cursor-default select-none relative py-2 pl-10 pr-4 ${active ? 'bg-cyan-50' : ''}`
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
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </Combobox>
              }
              control={control}
              name="project"
              rules={{required: 'Mandatory field'}}/>
            {errors.project && <span className="error">{errors.project.message}</span>}
          </div>
          <div className="relative mb-3 md:mb-0 w-full z-0">
            <input type="text"
                   className="input peer"
                   placeholder=" "
                   {...register('functionName', {required: 'Mandatory field', validate: functionNameIsUnique})}/>
            <label htmlFor="functionName"
                   className="label peer-focus:left-0 peer-focus:text-fuchsia-600 peer-focus:dark:text-fuchsia-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Function name</label>
            {errors.functionName && <span className="error">{errors.functionName.message}</span>}
          </div>
          <div className="relative mb-3 md:mb-0 w-full z-0">
            <input type="text"
                   className="input peer"
                   placeholder=" "
                   {...register('contractAddress', {required: 'Mandatory field'})}/>
            <label htmlFor="contractAddress"
                   className="label peer-focus:left-0 peer-focus:text-fuchsia-600 peer-focus:dark:text-fuchsia-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Contract address</label>
            {errors.contractAddress && <span className="error">{errors.contractAddress.message}</span>}
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button type="submit"
                  className="button"
                  disabled={isSubmitting || !isValid || !isDirty}>
            {isSubmitting && <LoadingCircle/>}
            {selectedOperation ? 'Edit' : 'Create'}
          </button>
          <button type="button"
                  className={`button secondary-button mr-4 ${selectedOperation ? '' : 'hidden'}`}
                  disabled={isSubmitting}
                  onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
