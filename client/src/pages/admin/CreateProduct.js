import React, { useCallback, useEffect, useState } from 'react';
import { InputForm, Select, Button, MarkdownEditor, Loading } from 'components';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { validate, getBase64 } from 'utils/helpers';
import { toast } from 'react-toastify';
import { apiCreateProduct } from 'apis';
import { showModal } from 'store/app/appSlice';

const CreateProduct = () => {
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const dispatch = useDispatch();

  const [payload, setPayload] = useState({
    description: '',
  });

  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });

  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        toast.warning('Only jpg and png files are allowed');
        return;
      }
      const base64Image = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64Image });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  useEffect(() => {
    handlePreviewThumb(watch('thumb')[0]);
  }, [watch('thumb')]);

  useEffect(() => {
    handlePreviewImages(watch('images'));
  }, [watch('images')]);

  const dispatchLoadingModal = async(isShowModal) =>{
    if(isShowModal){
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    } else{
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
    }
  }

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category) {
        data.category = categories?.find(
          (el) => el._id === data.category
        )?.title;
      }
      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) {
        formData.append(i[0], i[1]);
      }
      if (finalPayload.thumb) {
        formData.append('thumb', finalPayload.thumb[0]);
      }
      if (finalPayload.images) {
        for (let image of finalPayload.images) {
          formData.append('images', image);
        }
      }

      await dispatchLoadingModal(true);
      const response = await apiCreateProduct(formData);
      await dispatchLoadingModal(false);

      if (response?.success) {
        toast.success(response?.message);
        reset();
        setPayload({ description: '' });
        setPreview({
          thumb: null,
          images: [],
        });
      } else {
        toast.error(response?.message);
      }
    }
  };

  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl text-gray-800 font-bold px-4 border-b'>
        <span>Create new product</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label='Product name'
            register={register}
            errors={errors}
            id='title'
            validate={{ required: 'Required' }}
            fullWidth
            placeholder={'Enter product name'}
          />
          <div className='w-full flex gap-4 my-6'>
            <InputForm
              label='Price'
              register={register}
              errors={errors}
              id='price'
              validate={{ required: 'Required' }}
              style={'flex-1'}
              placeholder={'Enter the price of product'}
              type='number'
              fullWidth
            />
            <InputForm
              label='Quantity'
              register={register}
              errors={errors}
              id='quantity'
              validate={{ required: 'Required' }}
              style={'flex-1'}
              placeholder={'Enter the quantity of product'}
              type='number'
              fullWidth
            />
            <InputForm
              label='Color'
              register={register}
              errors={errors}
              id='color'
              validate={{ required: 'Required' }}
              style={'flex-1'}
              placeholder={'Enter the color of product'}
              fullWidth
            />
          </div>
          <div className='w-full flex gap-4 my-6'>
            <Select
              label='Category'
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
              register={register}
              id='category'
              validate={{ required: 'Required' }}
              style={'flex-1'}
              errors={errors}
            />
            <Select
              label='Brand (optional)'
              options={categories
                ?.find((el) => el._id === watch('category'))
                ?.brand?.map((el) => ({
                  code: el,
                  value: el,
                }))}
              register={register}
              id='brand'
              style={'flex-1'}
              errors={errors}
            />
          </div>
          <MarkdownEditor
            name='description'
            changeValue={changeValue}
            label='Description'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className='flex flex-col gap-2 mt-8'>
            <label className='' htmlFor='thumb'>
              Upload thumb
            </label>
            <input
              type='file'
              id='thumb'
              {...register('thumb', { required: 'required' })}
            />
            {errors['thumb'] && (
              <small className='text-xs text-red-500'>
                {errors['thumb']?.message}
              </small>
            )}
          </div>
          {preview.thumb && (
            <div className='my-4'>
              <img
                src={preview.thumb}
                alt='thumbnail'
                className='w-[200px] object-contain'
              />
            </div>
          )}
          <div className='flex flex-col gap-2 mt-8'>
            <label className='' htmlFor='images'>
              Upload product images
            </label>
            <input
              type='file'
              id='images'
              multiple
              {...register('images', { required: 'required' })}
            />
            {errors['images'] && (
              <small className='text-xs text-red-500'>
                {errors['images']?.message}
              </small>
            )}
          </div>
          {preview.images && (
            <div className='my-4 flex w-full gap-3 flex-wrap'>
              {preview?.images?.map((el, idx) => (
                <img
                  key={idx}
                  src={el.path}
                  alt='product image'
                  className='w-[200px] object-contain'
                />
              ))}
            </div>
          )}
          <div className='my-8'>
            <Button type='submit'>Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
