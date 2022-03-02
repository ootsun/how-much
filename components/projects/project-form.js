import {useForm} from 'react-hook-form';
import {create, getUploadSignature, update, uploadFormData} from '../../lib/client/projectHandler.js';
import {LoadingCircle} from '../loading-circle.js';
import {capitalizeFirstLetter} from '../../lib/utils/stringUtils.js';
import {useEffect, useState} from 'react';
import ErrorModal from '../error-modal.js';
import {Toast} from '../toast.js';
import ActionModal from '../action-modal.js';
import {Logo} from './logo.js';
import {ERROR_MESSAGES} from '../../lib/client/constants.js';

export function ProjectForm({selectedProject, setSelectedProject, setUpdateList}) {

  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [actionModalTitle, setActionModalTitle] = useState(null);
  const [actionModalMessage, setActionModalMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [previousSelectedProject, setPreviousSelectedProject] = useState(null);

  const {register, handleSubmit, formState, reset, setValue, getValues, watch} = useForm({
    mode: 'onTouched'
  });
  let {isSubmitting, errors, isValid, isDirty} = formState;
  const watchLogo = watch('logo', null);

  async function replaceFormValues() {
    reset();
    setValue('name', selectedProject.name);
    setPreviousSelectedProject(selectedProject);
  }

  async function handleActionModalResponse(res) {
    if (res) {
      await replaceFormValues();
    } else {
      setSelectedProject(previousSelectedProject);
    }
  }

  useEffect(async () => {
    if (selectedProject && selectedProject !== previousSelectedProject) {
      if (isDirty) {
        setActionModalTitle('Warning');
        setActionModalMessage('A project is already in the process of being created or edited. Are you sure you want to overwrite the changes?')
        toggleModal('projectFormActionModal');
      } else {
        await replaceFormValues();
      }
    }
  }, [selectedProject]);

  function createFormData(form, uploadSignature, public_id) {
    const formData = new FormData();
    formData.append('file', form.logo[0]);
    formData.append('api_key', uploadSignature.apiKey);
    formData.append('timestamp', uploadSignature.timestamp);
    formData.append('signature', uploadSignature.signature);
    formData.append('folder', process.env.NEXT_PUBLIC_CLOUDINARY_PROJECTS_FOLDER_NAME);
    formData.append('public_id', public_id);
    return formData;
  }

  function createFileName(form, name) {
    const originalFileName = form.logo[0].name;
    const tokens = originalFileName.split('.');
    const extension = tokens[tokens.length - 1];
    return name + '.' + extension;
  }

  async function uploadLogo(form, public_id) {

    let res = await getUploadSignature(public_id);
    if (!res.ok) {
      setErrorModalMessage(ERROR_MESSAGES.serverSide);
      toggleModal('projectFormErrorModal');
      return false;
    }
    const uploadSignature = await res.json();

    const formData = createFormData(form, uploadSignature, public_id);

    res = await uploadFormData(formData, uploadSignature.cloudName);
    if (!res.ok) {
      setErrorModalMessage(ERROR_MESSAGES.serverSide);
      toggleModal('projectFormErrorModal');
      return false;
    }
    const upload = await res.json();
    return upload.secure_url;
  }

  async function createProject(form) {
    const name = capitalizeFirstLetter(form.name).trim();
    const logoUrl = await uploadLogo(form, name);

    if(logoUrl) {
      const res = await create(name, logoUrl);
      if (!res.ok) {
        if(res.status === 400) {
          setErrorModalMessage("This project already exists");
        } else {
          setErrorModalMessage(ERROR_MESSAGES.serverSide);
        }
        toggleModal('projectFormErrorModal');
        return false;
      }
      setToastMessage('Project successfully created');
      return true;
    }
  }

  async function updateProject(form) {
    const name = capitalizeFirstLetter(form.name).trim();
    let logoUrl = selectedProject.logoUrl;
    if (form.logo && form.logo.length > 0) {
      const res = await uploadLogo(form, name);
      if(res) {
        logoUrl = res;
      } else {
        return false;
      }
    }
    const res = await update(selectedProject._id, name, logoUrl);
    if (!res.ok) {
      setErrorModalMessage(ERROR_MESSAGES.serverSide);
      toggleModal('projectFormErrorModal');
      return false;
    }
    setSelectedProject(null);
    setPreviousSelectedProject(null);
    setToastMessage('Project successfully updated');
    return true;
  }

  async function onSubmit(form) {
    try {
      let res;
      if (selectedProject) {
        res = await updateProject(form);
      } else {
        res = await createProject(form);
      }
      if(res) {
        setUpdateList(true);
        reset();
      }
    } catch (e) {
      setErrorModalMessage(ERROR_MESSAGES.connection);
      toggleModal('projectFormErrorModal');
    }
  }

  function inputFilePreviewUrl() {
    if (watchLogo) {
      return URL.createObjectURL(watchLogo[0]);
    }
    return null;
  }

  function onCancel() {
    setSelectedProject(null);
    setPreviousSelectedProject(null);
    reset();
  }

  return (
    <>
      <ActionModal title={actionModalTitle} message={actionModalMessage} callback={handleActionModalResponse} customId="projectFormActionModal"/>
      <ErrorModal message={errorModalMessage} customId="projectFormErrorModal"/>
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input autoComplete="false" name="hidden" type="text" className="hidden"/>
        <div className="grid sm:grid-cols-3 sm:gap-4">
          <div className="relative mb-3 md:mb-0 w-full z-0">
            <input type="text"
                   className="input peer"
                   placeholder=" "
                   {...register('name', {required: 'Mandatory field'})}/>
            <label htmlFor="name"
                   className="label peer-focus:left-0 peer-focus:text-fuchsia-600 peer-focus:dark:text-fuchsia-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Project name</label>
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
          <div className="relative w-full">
            <input
              aria-describedby="logo_help" {...register('logo', {required: selectedProject ? false : 'Mandatory field'})}
              type="file"
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="logo_help">
              Choose a small logo
            </div>
            {errors.logo && <span className="error">{errors.logo.message}</span>}
          </div>
          <div className="relative pb-4 w-full flex items-center">
            {(selectedProject || (watchLogo && watchLogo.length > 0)) &&
              <>
                <span>Preview :</span>
                <span className="ml-4">
                  {selectedProject?.logoUrl && !(watchLogo && watchLogo.length > 0) &&
                    <Logo url={selectedProject.logoUrl} alt={selectedProject.name}/>
                  }
                  {watchLogo && watchLogo[0] &&
                    <Logo url={inputFilePreviewUrl()} alt={getValues('name')}/>
                  }
                </span>
              </>
            }
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button type="submit"
                  className="button"
                  disabled={isSubmitting || !isValid || !isDirty}>
            {isSubmitting && <LoadingCircle/>}
            {selectedProject ? 'Edit' : 'Create'}
          </button>
          <button type="button"
                  className={`button secondary-button mr-4 ${selectedProject ? '' : 'hidden'}`}
                  disabled={isSubmitting}
                  onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
