import { Button, InputForm } from "components";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import avatar from "assets/avatar.png";
import { apiUpdateCurrent } from "apis";
import { getCurrent } from "store/user/asyncActions";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import withBase from "hocs/withBase";

const Personal = ({navigate}) => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const { current } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const[searchParams] = useSearchParams();

  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      email: current?.email,
      mobile: current?.mobile,
      avatar: current?.avatar,
      address: current?.address,
    });
  }, [current]);

  const handleUpdateInfo = async (data) => {
    const formData = new FormData();
    if (data?.avatar?.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    delete data.avatar;
    for (let i of Object.entries(data)) {
      formData.append(i[0], i[1]);
    }

    const response = await apiUpdateCurrent(formData);

    if (response?.success) {
      dispatch(getCurrent());
      toast.success(response.message);
      if(searchParams.get("redirect")){
        navigate(`${searchParams.get("redirect")}`)
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="w-full relative">
      <div className="h-[75px] w-full"></div>
      <div className="p-4 w-full bg-gray-100 flex justify-between items-center text-3xl text-gray-800 font-bold border-b fixed top-0">
        <h1>Personal</h1>
      </div>
      <form
        onSubmit={handleSubmit(handleUpdateInfo)}
        className="w-3/5 mx-auto py-8 flex flex-col gap-4"
      >
        <InputForm
          label="Firstname"
          register={register}
          errors={errors}
          id="firstname"
          validate={{ required: "Required" }}
        />
        <InputForm
          label="Lastname"
          register={register}
          errors={errors}
          id="lastname"
          validate={{ required: "Required" }}
        />
        <InputForm
          label="Email"
          register={register}
          errors={errors}
          id="email"
          validate={{
            required: "Required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
        />
        <InputForm
          label="Phone"
          register={register}
          errors={errors}
          id="mobile"
          validate={{
            required: "Required",
            pattern: {
              value: /^[62|0]+\d{9}/gi,
              message: "Invalid phone number",
            },
          }}
        />
        <InputForm
          label="Address"
          register={register}
          errors={errors}
          id="address"
          validate={{
            required: "Required",
          }}
        />
        <div className="flex items-center gap-2">
          <span className="font-semibold">Account status:</span>
          <span>{current?.isBlocked ? "Blocked" : "Active"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Role:</span>
          <span>{+current?.role === 1999 ? "Admin" : "User"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Created at:</span>
          <span>{moment(current?.createdAt).format("DD/MM/YYYY")}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold">Avatar:</span>
          <label htmlFor="avatar">
            <img
              src={current?.avatar || avatar}
              alt="avatar"
              className="w-20 h-20 object-cover rounded-full ml-16"
            />
          </label>
          <input type="file" id="avatar" {...register("avatar")} hidden />
        </div>
        {isDirty && (
          <div className="w-full flex justify-end">
            <Button type="submit">Update</Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default withBase(Personal);
