import { apiRemoveCart } from "apis";
import Button from "components/button/Button";
import withBase from "hocs/withBase";
import React, { memo } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { showCart } from "store/app/appSlice";
import { getCurrent } from "store/user/asyncActions";
import { formatMoney } from "utils/helpers";
import path from "utils/path";

const Cart = ({ dispatch, navigate }) => {
  const { currentCart } = useSelector((state) => state.user);

  const removeCart = async (pid, color) => {
    const response = await apiRemoveCart(pid, color);
    if (response?.success) {
      dispatch(getCurrent());
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="grid grid-rows-10 w-[400px] h-screen bg-stone-950 text-gray-100 p-6"
    >
      <header className="row-span-1 h-full flex items-center justify-between border-b border-gray-600 font-bold text-xl">
        <span>YOUR CART</span>
        <span
          onClick={() => dispatch(showCart())}
          className="cursor-pointer inline-block"
        >
          <FaTimes color="white" />
        </span>
      </header>
      <section className="my-1 row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3">
        {currentCart?.length === 0 && (
          <span className="text-xs italic">Your cart is empty.</span>
        )}
        {currentCart?.map((el) => (
          <div key={el?._id} className="flex items-center justify-between">
            <div className="flex gap-2">
              <img
                src={el?.thumbnail}
                alt="thumb"
                className="w-16 h-16 object-contain"
              />
              <div className="flex flex-col justify-between gap-1">
                <span className="text-sm">{el?.title?.toUpperCase()}</span>
                <span className="capitalize text-xs">
                  {`${el?.color?.toLowerCase()} | Quantity: ${el?.quantity}`}
                </span>
                <span className="text-xs">
                  {`${formatMoney(el?.price)} VND`}
                </span>
              </div>
            </div>
            <span
              onClick={() => removeCart(el?.product?._id, el?.color)}
              className="mr-1 h-8 w-8 hover:bg-stone-100 hover:text-stone-950 rounded-full flex items-center justify-center cursor-pointer"
            >
              <FaTrash size={16} />
            </span>
          </div>
        ))}
      </section>
      <div className="flex flex-col justify-between row-span-2 h-full ">
        <div className="flex items-center mt-2 justify-between pt-3 border-t border-gray-600">
          <span>Subtotal</span>
          {currentCart.length > 0 && (
            <span>{`${formatMoney(
              currentCart?.reduce(
                (sum, el) => sum + Number(el?.price * el?.quantity),
                0
              )
            )} VND`}</span>
          )}
        </div>
        <span className="flex justify-center text-xs italic text-stone-400">
          Shipping, taxes, and discounts calculated at checkout.
        </span>
        <Button
          handleOnClick={() => {
            dispatch(showCart());
            navigate(`/${path.MEMBER}/${path.CART_DETAIL}`);
          }}
          style="mt-2 rounded-none w-full bg-main py-1"
        >
          Check out
        </Button>
      </div>
    </div>
  );
};

export default withBase(memo(Cart));
