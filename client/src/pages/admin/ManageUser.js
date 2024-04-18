import React, { useEffect, useState, useCallback } from "react";
import { apiGetUsers, apiUpdateUsers, apiDeleteUsers } from "apis/user";
import { roles, blockStatus } from "utils/contants";
import moment from "moment";
import { InputField, Pagination, InputForm, Select, Button } from "components";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import clsx from 'clsx';
import {BiEdit, BiTrash, BiArrowBack} from "react-icons/bi"

const ManageUser = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    isBlocked: "",
  });

  const [users, setUsers] = useState(null);

  const [queries, setQueries] = useState({
    q: "",
  });

  const [update, setUpdate] = useState(false);

  const [editUser, setEditUser] = useState(null);

  const [params] = useSearchParams();

  const fetchUsers = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response?.success) {
      setUsers(response);
    }
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const queriesDebounce = useDebounce(queries.q, 800);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) {
      queries.q = queriesDebounce;
    }
    console.log(queries)
    fetchUsers(queries);
  }, [queriesDebounce, params, update]);

  const handleUpdateUser = async (data) => {
    console.log(data)
    const response = await apiUpdateUsers(data, editUser._id);
    if (response?.success) {
      setEditUser(null);
      render();
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteUser = async (uid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUsers(uid);
        if (response?.success) {
          render();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }
    });
  };

  useEffect(() => {
    if(editUser){
      reset({
        email: editUser.email,
        firstname: editUser.firstname,
        lastname: editUser.lastname,
        mobile: editUser.mobile,
        role: editUser.role,
        isBlocked: editUser.isBlocked
      })}
  },[editUser]);

  return (
    <div className={clsx('w-full', editUser && 'pl-[96px]')}>
      <h1 className="h-[75px] flex justify-between items-center text-3xl text-gray-800 font-bold px-4 border-b">
        <span>Manage users</span>
      </h1>
      <div className="w-full p-4 text-sm">
        <div className="flex justify-end py-4">
          <InputField
            value={queries.q}
            setValue={setQueries}
            nameKey="q"
            isHideLabel
            style={"w-[300px] placeholder:text-xs"}
            placeholder={"Search by fullname or email"}
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdateUser)}>
          {editUser && <Button type="submit">Update</Button>}
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-bold bg-gray-600 border border-gray-600 text-white">
              <tr className="">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Firstname</th>
                <th className="px-4 py-2">Lastname</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((el, idx) => (
                <tr key={el._id} className="border border-gray-600">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">
                    {editUser?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editUser?.email}
                        id={"email"}
                        validate={{
                          required: "Required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editUser?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editUser?.firstname}
                        id={"firstname"}
                        validate={{ required: "Required" }}
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editUser?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editUser?.lastname}
                        id={"lastname"}
                        validate={{ required: "Required" }}
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editUser?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={el.role}
                        id={"role"}
                        validate={{ required: "Required" }}
                        options={roles}
                      />
                    ) : (
                      <span>
                        {roles.find((role) => +role.code === +el.role)?.value}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editUser?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editUser?.mobile}
                        id={"mobile"}
                        validate={{
                          required: "Required",
                          pattern: {
                            value: /^[62|0]+\d{9}/gi,
                            message: "Invalid phone number",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editUser?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={el.isBlocked}
                        id={"isBlocked"}
                        validate={{ required: "Required" }}
                        options={blockStatus}
                      />
                    ) : (
                      <span>{el.isBlocked ? "Blocked" : "Active"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editUser?._id === el._id ? (
                      <span
                        onClick={() => setEditUser(null)}
                        className="px-2 text-blue-500 hover:text-blue-800 cursor-pointer inline-block"
                      >
                        <BiArrowBack size={16} />
                      </span>
                    ) : (
                      <span
                        onClick={() => setEditUser(el)}
                        className="px-2 text-blue-500 hover:text-blue-800 cursor-pointer inline-block"
                      >
                        <BiEdit size={16} />
                      </span>
                    )}
                    <span
                      onClick={() => handleDeleteUser(el._id)}
                      className="px-2 text-main hover:text-red-700 cursor-pointer inline-block"
                    >
                      <BiTrash size={16} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        <div className="w-full flex justify-end">
          <Pagination totalCount={users?.count} />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
