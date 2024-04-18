import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import { apiGetProducts, apiDeleteProduct } from "apis";
import moment from "moment";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import UpdateProduct from "./UpdateProduct";
import CustomizeVariant from './CustomizeVariant'
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BiEdit, BiCustomize, BiTrash } from "react-icons/bi";

const ManageProduct = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();

  const location = useLocation();

  const [params] = useSearchParams();

  const [products, setProducts] = useState(null);

  const [productCount, setProductCount] = useState(0);

  const [editProduct, setEditProduct] = useState(null);

  const [update, setUpdate] = useState(false);

  const [customizeVariant, setCustomizeVariant] = useState(null);

  const render = useCallback(() => {
    setUpdate(!update);
  });

  const fetchProducts = async (params) => {
    const response = await apiGetProducts({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response?.success) {
      setProductCount(response.count);
      setProducts(response.productData);
    }
  };

  const queryDebounce = useDebounce(watch("q"), 800);

  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDebounce }).toString(),
      });
    } else {
      navigate({
        pathname: location.pathname,
      });
    }
  }, [queryDebounce]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProducts(searchParams);
  }, [params, update]);

  const handleDeleteProduct = async (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteProduct(pid);
        if (response?.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        render();
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {editProduct && (
        <div className="absolute inset-0  bg-gray-100 min-h-screen z-50">
          <UpdateProduct
            editProduct={editProduct}
            render={render}
            setEditProduct={setEditProduct}
          />
        </div>
      )}
      {customizeVariant && (
        <div className="absolute inset-0  bg-gray-100 min-h-screen z-50">
          <CustomizeVariant
            customizeVariant={customizeVariant}
            render={render}
            setCustomizeVariant={setCustomizeVariant}
          />
        </div>
      )}
      <div className="h-[75px] w-full"></div>
      <div className="p-4 w-full bg-gray-100 flex justify-between items-center text-3xl text-gray-800 font-bold border-b fixed top-0">
        <h1>Manage products</h1>
      </div>
      <div className="flex w-full justify-end items-center px-4">
        <form className="w-[45%]">
          <InputForm
            style={"placeholder:text-xs placeholder:italic"}
            register={register}
            errors={errors}
            id="q"
            fullWidth
            placeholder={"Search by title, description,..."}
          />
        </form>
      </div>
      <table className="table-auto text-xs">
        <thead>
          <tr className="font-bold bg-gray-600 border border-gray-600 text-white">
            <th className="text-center p-2">No.</th>
            <th className="text-center p-2">Thumb</th>
            <th className="text-center p-2">Title</th>
            <th className="text-center p-2">Brand</th>
            <th className="text-center p-2">Category</th>
            <th className="text-center p-2">Price</th>
            <th className="text-center p-2">Quantity</th>
            <th className="text-center p-2">Sold</th>
            <th className="text-center p-2">Ratings</th>
            <th className="text-center p-2">Variants</th>
            <th className="text-center p-2">Color</th>
            <th className="text-center p-2">Last update</th>
            <th className="text-center p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((el, idx) => (
            <tr key={el._id} className="border-b">
              <td className="text-center py-2">
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  idx +
                  1}
              </td>
              <td className="text-center py-2">
                <img
                  src={el.thumb}
                  alt="thumb"
                  className="w-12 h-12 object-cover"
                ></img>
              </td>
              <td className="text-center py-2">{el.title}</td>
              <td className="text-center py-2">{el.brand}</td>
              <td className="text-center py-2">{el.category}</td>
              <td className="text-center py-2">{el.price}</td>
              <td className="text-center py-2">{el.quantity}</td>
              <td className="text-center py-2">{el.sold}</td>
              <td className="text-center py-2">{el.totalRating}</td>
              <td className="text-center py-2">{el.variant.length || 0}</td>
              <td className="text-center py-2">{el.color}</td>
              <td className="text-center py-2">
                {moment(el.updatedAt).format("DD/MM/YYYY")}
              </td>
              <td className="text-center py-2">
                <span
                  onClick={() => {
                    setEditProduct(el);
                  }}
                  className="px-2 text-blue-500 hover:text-blue-800 cursor-pointer inline-block"
                >
                  <BiEdit size={16} />
                </span>
                <span
                  onClick={() => {
                    setCustomizeVariant(el);
                  }}
                  className="px-2 text-blue-500 hover:text-blue-800 cursor-pointer inline-block"
                >
                  <BiCustomize size={16} omize />
                </span>
                <span
                  onClick={() => handleDeleteProduct(el._id)}
                  className="px-2 text-main hover:text-red-700 cursor-pointer inline-block"
                >
                  <BiTrash size={16} h />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={productCount} />
      </div>
    </div>
  );
};

export default ManageProduct;
