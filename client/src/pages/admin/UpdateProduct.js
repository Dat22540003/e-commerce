import { InputForm, MarkdownEditor, Select, Button, Loading } from "components";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { apiUpdateProduct } from "apis";
import { showModal } from "store/app/appSlice";
import { useSelector, useDispatch } from "react-redux";

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const dispatch = useDispatch();

  const [payload, setPayload] = useState({
    description: "",
  });

  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });

  useEffect(() => {
    reset({
      title: editProduct?.title || "",
      price: editProduct?.price || "",
      quantity: editProduct?.quantity || "",
      color: editProduct?.color || "",
      category: editProduct?.category || "",
      brand: editProduct?.brand?.toLowerCase() || "",
    });
    setPayload({
      description:
        typeof editProduct?.description === "object"
          ? editProduct?.description?.join(", ")
          : editProduct?.description,
    });
    setPreview({
      thumb: editProduct?.thumb || "",
      images: editProduct?.images || [],
    });
  }, [editProduct]);

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

  const dispatchLoadingModal = async (isShowModal) => {
    if (isShowModal) {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    } else {
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
    }
  };

  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category) {
        data.category = categories?.find(
          (el) => el.title === data.category
        )?.title;
      }
      const finalPayload = { ...data, ...payload };
      finalPayload.thumb =
        data?.thumb?.length === 0 ? preview?.thumb : data?.thumb[0];

      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) {
        formData.append(i[0], i[1]);
      }
      finalPayload.images =
        data?.images?.length === 0 ? preview?.images : data?.images;
      for (let image of finalPayload.images) {
        formData.append("images", image);
      }
      await dispatchLoadingModal(true);
      const response = await apiUpdateProduct(formData, editProduct?._id);
      await dispatchLoadingModal(false);
      
      if (response?.success) {
        toast.success(response?.message);
        render();
        setEditProduct(null);
      } else {
        toast.error(response?.message);
      }
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[75px] w-full"></div>
      <div className="p-4 bg-gray-100 flex justify-between items-center text-gray-800  border-b fixed right-0 left-[250px] top-0">
        <h1 className="text-3xl font-bold">Update products</h1>
        <span
          className="px-2 text-blue-500 hover:underline cursor-pointer"
          onClick={() => setEditProduct(null)}
        >
          Cancel
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label="Product name"
            register={register}
            errors={errors}
            id="title"
            validate={{ required: "Required" }}
            fullWidth
            placeholder={"Enter product name"}
          />
          <div className="w-full flex gap-4 my-6">
            <InputForm
              label="Price"
              register={register}
              errors={errors}
              id="price"
              validate={{ required: "Required" }}
              style={"flex-1"}
              placeholder={"Enter the price of product"}
              type="number"
              fullWidth
            />
            <InputForm
              label="Quantity"
              register={register}
              errors={errors}
              id="quantity"
              validate={{ required: "Required" }}
              style={"flex-1"}
              placeholder={"Enter the quantity of product"}
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
              placeholder={"Enter the color of product"}
              fullWidth
            />
          </div>
          <div className="w-full flex gap-4 my-6">
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el.title,
                value: el.title,
              }))}
              register={register}
              id="category"
              validate={{ required: "Required" }}
              style={"flex-1"}
              errors={errors}
            />
            <Select
              label="Brand (optional)"
              options={categories
                ?.find((el) => el.title === watch("category"))
                ?.brand?.map((el) => ({
                  code: el.toLowerCase(),
                  value: el,
                }))}
              register={register}
              id="brand"
              style={"flex-1"}
              errors={errors}
            />
          </div>
          <MarkdownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            value={payload.description}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="" htmlFor="thumb">
              Upload thumb
            </label>
            <input type="file" id="thumb" {...register("thumb")} />
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
            <input type="file" id="images" multiple {...register("images")} />
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
          <div className="my-8">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);
