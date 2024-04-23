import { Breadcrumb, Button, OrderedItem, SelectQuantity } from "components";
import withBase from "hocs/withBase";
import React from "react";
import { useSelector } from "react-redux";
import { Link, createSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { formatMoney } from "utils/helpers";
import path from "utils/path";

const CartDetail = ({ navigate, location }) => {
  const { currentCart, current } = useSelector((state) => state.user);
  const handleCheckout = () => {
    if (!current?.address) {
      return Swal.fire({
        title: "Oops!",
        text: "Please update your address to continue!",
        icon: "info",
        showConfirmButton: true,
        confirmButtonText: "Update now",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate({
            pathname: `/${path.MEMBER}/${path.PERSONAL}`,
            search: createSearchParams({
              redirect: location?.pathname,
            }).toString(),
          });
        }
      });
    } else {
      window.open(`/${path.CHECKOUT}`, "_blank");
    }
  };

  return (
    <div className="w-full">
      <div className="h-[75px] w-full"></div>
      <div className="p-4 w-full bg-gray-100 flex justify-between items-center text-3xl text-gray-800 font-bold border-b fixed top-0">
        <h1>My cart</h1>
      </div>
      <div className="w-full my-8 flex flex-col border mt-8">
        <div className="w-full font-semibold mx-auto py-3 grid grid-cols-10 bg-stone-300">
          <span className="col-span-6 w-full text-center uppercase">
            Product
          </span>
          <span className="col-span-1 w-full text-center uppercase">
            Quantity
          </span>
          <span className="col-span-3 w-full text-center uppercase">Price</span>
        </div>
        {currentCart?.map((el) => (
          <OrderedItem
            key={el._id}
            defaultQuantity={el?.quantity}
            color={el?.color}
            title={el?.title}
            thumbnail={el?.thumbnail}
            price={el?.price}
            pid={el?.product?._id}
          />
        ))}
      </div>
      <div className="w-full mx-auto mb-12 flex flex-col gap-3 justify-center items-end">
        <span className="flex items-center gap-2">
          <span className="font-semibold">Subtotal:</span>
          {currentCart?.length > 0 && (
            <span>{`${formatMoney(
              currentCart?.reduce(
                (sum, el) => sum + Number(el?.price * el?.quantity),
                0
              )
            )} VND`}</span>
          )}
        </span>
        <span className="text-xs italic text-stone-400">
          Shipping, taxes, and discounts calculated at checkout.
        </span>
        <Button handleOnClick={handleCheckout}>Check out</Button>
      </div>
    </div>
  );
};

export default withBase(CartDetail);
