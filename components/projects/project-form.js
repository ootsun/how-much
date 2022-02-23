import {useForm} from 'react-hook-form';
import {create, getUploadSignature, uploadFormData} from '../../lib/client/projectHandler.js';
import {LoadingCircle} from '../loading-circle.js';
import {capitalizeFirstLetter} from '../../lib/utils/stringUtils.js';
import {useState} from 'react';
import ErrorModal from '../error-modal.js';
import {Toast} from '../toast.js';

export function ProjectForm() {

  const [modalMessage, setModalMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const {register, handleSubmit, formState, reset} = useForm({
    mode: 'onTouched'
  });
  let {isSubmitting, errors, isValid} = formState;

  function createFormData(form, uploadSignature, fileName) {
    const formData = new FormData();
    formData.append('file', form.logo[0]);
    formData.append('api_key', uploadSignature.apiKey);
    formData.append('timestamp', uploadSignature.timestamp);
    formData.append('signature', uploadSignature.signature);
    formData.append('folder', 'projectsLogo');
    formData.append('public_id', fileName);
    return formData;
  }

  async function onSubmit(form) {
    const name = capitalizeFirstLetter(form.name);
    const fileName = form.logo[0].name;

    try {
      let res = await getUploadSignature(fileName);
      if (!res.ok) {
        setModalMessage('An server side error occurred. Please, retry later.');
        toggleModal('errorModal');
        return;
      }
      const uploadSignature = await res.json();

      const formData = createFormData(form, uploadSignature, fileName);

      res = await uploadFormData(formData, uploadSignature.cloudName);
      if (!res.ok) {
        setModalMessage('An server side error occurred. Please, retry later.');
        toggleModal('errorModal');
        return;
      }
      const upload = await res.json();

      res = await create(name, upload.secure_url);
      if (!res.ok) {
        setModalMessage('An server side error occurred. Please, retry later.');
        toggleModal('errorModal');
        return;
      }
      reset();
      setToastMessage('Project successfully created');
    } catch (e) {
      setModalMessage('An error occured. Check you internet connectivity.');
      toggleModal('errorModal');
    }
  }

  return (
    <>
      <ErrorModal modalMessage={modalMessage}/>
      <Toast message={toastMessage} setMessage={setToastMessage}/>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input autoComplete="false" name="hidden" type="text" className="hidden"/>
        <div className="grid sm:grid-cols-2 sm:gap-6">
          <div className="relative z-0 mb-6 w-full group">
            <input type="text"
                   className="input peer"
                   placeholder=" "
                   {...register('name', {required: 'Mandatory field'})}/>
            <label htmlFor="name"
                   className="label peer-focus:left-0 peer-focus:text-fuchsia-600 peer-focus:dark:text-fuchsia-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Project name</label>
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <input aria-describedby="logo_help" {...register('logo', {required: 'Mandatory field'})} type="file"
                   className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="logo_help">
              Choose a small logo
            </div>
            {errors.logo && <span className="error">{errors.logo.message}</span>}
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button type="submit"
                  className="button"
                  disabled={isSubmitting || !isValid}>
            {isSubmitting && <LoadingCircle/>}
            Create
          </button>
        </div>
      </form>
    </>
  );
}
