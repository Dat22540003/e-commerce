import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputForm, Button, Loading } from "components";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { showModal } from 'store/app/appSlice';
import { useDispatch } from 'react-redux';
import { apiAddVariant } from "apis";

const CustomizeVariant = ({
  customizeVariant,
  setCustomizeVariant,
  render,
}) => {
  const dispatch = useDispatch();

  const [preview, setPreview] = useState({
    thumb: "",
    images: [],
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    reset({
      title: customizeVariant?.title || "",
      price: customizeVariant?.price || "",
      color: customizeVariant?.color || "",
    });
  }, [customizeVariant]);

  const dispatchLoadingModal = async(isShowModal) =>{
    if(isShowModal){
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    } else{
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
    }
  }

  const handleAddVariant = async (data) => {
    if(data?.color === customizeVariant?.color){
      Swal.fire('Oops...', 'Color already exists!', 'error')
      return;
    } else{
      const formData = new FormData();
      for (let i of Object.entries(data)) {
        formData.append(i[0], i[1]);
      }
      if (data.thumb) {
        formData.append('thumb', data.thumb[0]);
      }
      if (data.images) {
        for (let image of data.images) {
          formData.append('images', image);
        }
      }

      await dispatchLoadingModal(true);
      const response = await apiAddVariant(formData, customizeVariant?._id);
      await dispatchLoadingModal(false);
      
      if (response?.success) {
        toast.success(response?.message);
        reset();
        setPreview({
          thumb: null,
          images: [],
        });
      } else {
        toast.error(response?.message);
      }
    }
  };

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewImages = async (files) => {
    if (files) {
      const imagesPreview = [];
      for (let file of files) {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          toast.warning("Only jpg and png files are allowed");
          return;
        }
        const base64Image = await getBase64(file);
        imagesPreview.push(base64Image);
      }
      setPreview((prev) => ({ ...prev, images: imagesPreview }));
    }
  };

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0) {
      handlePreviewThumb(watch("thumb")[0]);
    }
  }, [watch("thumb")]);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0) {
      handlePreviewImages(watch("images"));
    }
  }, [watch("images")]);

  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[75px] w-full"></div>
      <div className="p-4 bg-gray-100 flex justify-between items-center text-gray-800  border-b fixed right-0 left-[250px] top-0">
        <h1 className="text-3xl font-bold">Customize variants of product</h1>
        <span
          className="px-2 text-blue-500 hover:underline cursor-pointer"
          onClick={() => setCustomizeVariant(null)}
        >
          Back
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleAddVariant)}
        className="p-4 flex flex-col gap-4"
      >
        <div className="flex gap-4 items-center">
          <InputForm
            label="Variant name"
            register={register}
            errors={errors}
            validate={{ required: "Required" }}
            id="title"
            fullWidth
            style={"flex-1"}
            placeholder={"Enter the name of variant"}
          />
        </div>
        <div className="flex gap-4 items-center">
          <InputForm
            label="Price"
            register={register}
            errors={errors}
            id="price"
            validate={{ required: "Required" }}
            style={"flex-1"}
            placeholder={"Enter the price of variant"}
            type="number"
            fullWidth
          />
          <InputForm
            label="Color"
            register={register}
            errors={errors}
            id="color"
            validate={{ required: "Required" }}
            style={"flex-1"}
            placeholder={"Enter the color of variant"}
            fullWidth
          />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          <label className="" htmlFor="thumb">
            Upload thumb
          </label>
          <input
            type="file"
            id="thumb"
            {...register("thumb", { required: "required" })}
          />
          {errors["thumb"] && (
            <small className="text-xs text-red-500">
              {errors["thumb"]?.message}
            </small>
          )}
        </div>
        {preview.thumb && (
          <div className="my-4">
            <img
              src={preview.thumb}
              alt="thumbnail"
              className="w-[200px] object-contain"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 mt-8">
          <label className="" htmlFor="images">
            Upload product images
          </label>
          <input
            type="file"
            id="images"
            multiple
            {...register("images", { required: "required" })}
          />
          {errors["images"] && (
            <small className="text-xs text-red-500">
              {errors["images"]?.message}
            </small>
          )}
        </div>
        {preview.images && (
          <div className="my-4 flex w-full gap-3 flex-wrap">
            {preview?.images?.map((el, idx) => (
              <img
                key={idx}
                src={el}
                alt="product image"
                className="w-[200px] object-contain"
              />
            ))}
          </div>
        )}
        <div className="">
          <Button type="submit">Add</Button>
        </div>
      </form>
    </div>
  );
};

export default memo(CustomizeVariant);
