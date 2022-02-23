import {useForm} from 'react-hook-form';
import {create, getUploadSignature, uploadFormData} from '../../lib/client/projectHandler.js';
import {LoadingCircle} from '../loading-circle.js';
import {capitalizeFirstLetter} from '../../lib/utils/stringUtils.js';

export function ProjectForm() {

  const {register, handleSubmit, formState, reset} = useForm({
    mode: 'onTouched'
  });
  let {isSubmitting, errors, isValid} = formState;

  async function onSubmit(form) {
    const originalFileName = form.logo[0].name;
    const tokens = originalFileName.split('.');
    const extension = tokens[tokens.length - 1];
    const fileName = form.name + '.' + extension;
    const uploadSignature = await getUploadSignature(fileName);
    const name = capitalizeFirstLetter(form.name);

    const formData = new FormData();
    formData.append('file', form.logo[0]);
    formData.append('api_key', uploadSignature.apiKey);
    formData.append('timestamp', uploadSignature.timestamp);
    formData.append('signature', uploadSignature.signature);
    formData.append('folder', 'projectsLogo');
    formData.append('public_id', fileName);

    const upload = await uploadFormData(formData, uploadSignature.cloudName);
    const res = await create(name, upload.secure_url);
    if (res) {
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autocomplete="off">
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
            Choose a small logo that could be rendered in a circle
          </div>
          {errors.logo && <span>{errors.logo.message}</span>}
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
    </form>);
}
