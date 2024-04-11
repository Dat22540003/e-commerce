import React, { memo } from "react";
import { renderStarFromNumber, formatMoney } from "utils/helpers";

const ProductCard = ({ title, price, totalRating, thumb }) => {
  return (
    <div className="w-1/3 flex-auto px-[10px] mb-[20px]">
      <div className="w-full flex border">
        <img
          src={thumb}
          alt="products"
          className="w-[120px] object-contain p-4"
        />
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full text-xs">
          <span className="line-clamp-1 capitalize text-sm">
            {title?.toLowerCase()}
          </span>
          <span className="flex h-4">
            {renderStarFromNumber(totalRating, 14).map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span>{`${formatMoney(price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
