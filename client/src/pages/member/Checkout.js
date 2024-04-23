import React, { useEffect, useState } from "react";
import payment from "assets/payment.svg";
import { useSelector } from "react-redux";
import { formatMoney } from "utils/helpers";
import { Congrat, Paypal } from "components";
import withBase from "hocs/withBase";
import { getCurrent } from "store/user/asyncActions";

const Checkout = ({ dispatch, navigate }) => {
  const { currentCart, current } = useSelector((state) => state.user);

  const [isSucceed, setIsSucceed] = useState(false);

  useEffect(() => {
    if (isSucceed) {
      dispatch(getCurrent());
    }
  }, [isSucceed]);

  return (
    <div className="p-8 w-full grid grid-cols-10 gap-6 h-full max-h-screen overflow-y-auto">
      {isSucceed && <Congrat />}
      <div className="w-full flex justify-center items-center col-span-3">
        <img src={payment} alt="payment" className="h-[60%] object-contain" />
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-6 col-span-7">
        <h2 className="text-2xl font-bold">CHECKOUT</h2>
        <div className="w-full flex flex-col justify-between gap-4">
          <table className="table-auto w-full">
            <thead>
              <tr className="border bg-gray-300">
                <th className="text-left p-2">Product</th>
                <th className="text-center p-2">Quantity</th>
                <th className="text-right p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentCart?.map((el) => (
                <tr key={el._id} className="border">
                  <td className="text-left p-2">{el?.title}</td>
                  <td className="text-center p-2">{el?.quantity}</td>
                  <td className="text-right p-2">{`${formatMoney(
                    el?.price
                  )} VND`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className="flex gap-2">
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
          <span className="flex gap-2">
            <span className="font-semibold">Address:</span>
            <span>{current?.address}</span>
          </span>
          <div className="w-full mt-2">
            <Paypal
              payload={{
                products: currentCart,
                total: Math.round(
                  currentCart?.reduce(
                    (sum, el) => sum + Number(el?.price * el?.quantity),
                    0
                  ) / 23500
                ),
                address: current?.address,
              }}
              setIsSucceed={setIsSucceed}
              amount={Math.round(
                currentCart?.reduce(
                  (sum, el) => sum + Number(el?.price * el?.quantity),
                  0
                ) / 23500
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(Checkout);
