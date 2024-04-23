import { apiGetUserOrder } from "apis";
import { CustomSelect, InputForm, Pagination } from "components";
import withBase from "hocs/withBase";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { orderStatus } from "utils/contants";

const BuyHistory = ({ navigate, location }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const q = watch("q");

  const status = watch("status");

  const [order, setOrder] = useState(null);

  const [orderCount, setOrderCount] = useState(0);

  const [params] = useSearchParams();

  const fetchOrders = async (params) => {
    const response = await apiGetUserOrder({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response?.success) {
      setOrderCount(response.count);
      setOrder(response.order);
    } else{
      setOrderCount(0);
      setOrder(null);
    }
  };

  useEffect(() => {
    const pr = Object.fromEntries([...params]);
    fetchOrders(pr);
  }, [params]);

  const handleSearchStatus = ({ value }) => {
    navigate({
      location: location.pathname,
      search: createSearchParams({ status: value }).toString(),
    });
  };
  return (
    <div className="w-full relative">
      <div className="h-[75px] w-full"></div>
      <div className="p-4 w-full bg-gray-100 flex justify-between items-center text-3xl text-gray-800 font-bold border-b z-50 fixed top-0">
        <h1>Buy history</h1>
      </div>
      <div className="flex w-full justify-end items-center px-4">
        <form className="w-[55%] grid grid-cols-2 gap-2">
          <div className="col-span-1">
            <InputForm
              style={"placeholder:text-xs placeholder:italic"}
              register={register}
              errors={errors}
              id="q"
              fullWidth
              placeholder={"Search by title, description,..."}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <CustomSelect
              options={orderStatus}
              value={status}
              onChange={(val)=>handleSearchStatus(val)}
              wrapClassName={"w-full"}
            />
          </div>
        </form>
      </div>
      <table className="table-auto text-xs w-full">
        <thead>
          <tr className="font-bold bg-gray-600 border border-gray-600 text-white">
            <th className="text-center p-2">No.</th>
            <th className="text-center p-2">Product</th>
            <th className="text-center p-2">Total pay</th>
            <th className="text-center p-2">Status</th>
            <th className="text-center p-2">Order date</th>
          </tr>
        </thead>
        <tbody>
          {order?.map((el, idx) => (
            <tr key={el._id} className="border-b">
              <td className="text-center py-2">
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  idx +
                  1}
              </td>
              <td className="text-center py-2">
                <span className="flex flex-col">
                  {el?.products?.map((item) => (
                    <span
                      key={item._id}
                      className="capitalize"
                    >{`${item?.title?.toLowerCase()} | Color: ${item?.color?.toLowerCase()} | Quantity: ${item?.quantity}`}</span>
                  ))}
                </span>
              </td>
              <td className="text-center py-2">{`${el?.total} $`}</td>
              <td className="text-center py-2">{el?.status}</td>
              <td className="text-center py-2">
                {" "}
                {moment(el?.createdAt)?.format("DD/MM/YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={orderCount} />
      </div>
    </div>
  );
};

export default withBase(BuyHistory);
