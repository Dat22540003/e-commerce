import React from "react";
import { InputForm, Select, Button } from "components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const CreateProduct = () => {
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const handleCreateProduct = (data) => {
    if(data.category){
      data.category = categories?.find(el => el._id ===data.category)?.title;
    }
    console.log(data);
  };

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl text-gray-800 font-bold px-4 border-b">
        <span>Create new product</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
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
                code: el._id,
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
              options={categories?.find((el) =>
                (el._id === watch("category")))?.brand?.map((el) => ({
                  code: el,
                  value: el,
                }))
              }
              register={register}
              id="brand"
              style={"flex-1"}
              errors={errors}
            />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
