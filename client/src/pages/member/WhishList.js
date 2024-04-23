import { Button, Product } from "components";
import React from "react";
import { useSelector } from "react-redux";

const WhishList = () => {
  const { current } = useSelector((state) => state.user);
  console.log(current);
  return (
    <div className="w-full relative">
      <div className="h-[75px] w-full"></div>
      <div className="p-4 w-full bg-gray-100 flex justify-between items-center text-3xl text-gray-800 font-bold border-b fixed top-0">
        <h1>Wish list</h1>
      </div>
      <div className="p-4 w-full flex flex-wrap items-center justify-around gap-4">
        {current?.wishlist?.map((el) => (
          <div key={el._id} className="bg-white w-[300px] rounded-md drop-shadow flex flex-col gap-3 items-center">
            <Product
              pid={el._id}
              productData={el}
              style="py-[10px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhishList;
