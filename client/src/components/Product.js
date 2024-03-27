import React, { useState } from "react";
import { formatMoney, renderStarFromNumber } from "../utils/helpers";
import labelYellow from "../assets/label-yellow.png";
import labelEmerald from "../assets/label-emerald.png";
import { SelectOption } from "./";
import icons from "../utils/icons";

const { AiFillEye, IoMenu, AiFillHeart } = icons;

const Product = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  return (
    <div className="w-full text-base px-[10px]">
      <div
        className="w-full border p-[15px] flex flex-col items-center"
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <SelectOption icon={<AiFillEye />} />
              <SelectOption icon={<IoMenu />} />
              <SelectOption icon={<AiFillHeart />} />
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
            }
            alt=""
            className="w-[274px] h-[274px] object-cover"
          />
          <img
            src={isNew ? labelYellow : labelEmerald}
            alt=""
            className={`absolute w-[100px] h-[35px] top-[0px] right-[0px] object-contain`}
          />
          <span
            className={`font-semibold absolute text-white ${
              isNew ? "top-[5px] right-[22px]" : "top-[8px] right-[4px] text-sm"
            }`}
          >
            {isNew ? "NEW" : "TRENDING"}
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRating)?.map(
              (el, index) => (
                <span key={index}>{el}</span>
              ))}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
