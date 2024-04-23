import React, { useState, memo } from "react";
import { formatMoney, renderStarFromNumber } from "utils/helpers";
import labelYellow from "assets/label-yellow.png";
import labelEmerald from "assets/label-emerald.png";
import { SelectOption } from "components";
import icons from "utils/icons";
import withBase from "hocs/withBase";
import { showModal } from "store/app/appSlice";
import { ProductDetail } from "pages/public";
import { apiUpdateCart, apiUpdateWishlist } from "apis";
import { toast } from "react-toastify";
import { getCurrent } from "store/user/asyncActions";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "utils/path";
import { createSearchParams } from "react-router-dom";
import clsx from "clsx";

const { AiFillEye, BsFillCartPlusFill, BsCartCheckFill, AiFillHeart } = icons;

const Product = ({
  productData,
  isNew,
  normal,
  navigate,
  dispatch,
  location,
  pid,
  style,
}) => {
  const [isShowOption, setIsShowOption] = useState(false);
  const { current } = useSelector((state) => state.user);

  const handleClickOption = async (e, flag) => {
    e.stopPropagation();
    if (flag === "CART") {
      if (!current) {
        return Swal.fire({
          title: "Oops!",
          text: "Please login to continue!",
          icon: "info",
          showConfirmButton: true,
          confirmButtonText: "Go to login page",
          showCancelButton: true,
          cancelButtonText: "Not now",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location?.pathname,
              }).toString(),
            });
          }
        });
      }
      const response = await apiUpdateCart({
        pid: productData?._id,
        color: productData?.color,
        quantity: 1,
        price: productData?.price,
        thumbnail: productData?.thumb,
        title: productData?.title,
      });
      if (response?.success) {
        toast.success(response?.message);
        dispatch(getCurrent());
      } else {
        toast.error(response?.message);
      }
    }
    if (flag === "WHISHLIST") {
      const response = await apiUpdateWishlist(pid);
      if(response?.success){
        dispatch(getCurrent());
        toast.success(response?.message);
      } else{
        toast.error(response?.message);
      }
    }
    if (flag === "QUICK_VIEW") {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <ProductDetail
              data={{ pid: productData?._id, category: productData?.category }}
              isQuickView
            />
          ),
        })
      );
    }
  };
  return (
    <div className={clsx("w-full text-base px-[10px]", style)}>
      <div
        className="w-full border p-[15px] flex flex-col items-center"
        onClick={() =>
          navigate(
            `/${productData?.category?.toLowerCase()}/${productData?._id}/${
              productData?.title
            }`
          )
        }
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
              <span
                title="Quick view"
                onClick={(e) => handleClickOption(e, "QUICK_VIEW")}
              >
                <SelectOption icon={<AiFillEye />} />
              </span>
              {current?.cart?.some(
                (el) => el?.product?._id === productData?._id
              ) ? (
                <span
                  title="Added to cart"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <SelectOption icon={<BsCartCheckFill color="gray" />} />
                </span>
              ) : (
                <span
                  title="Add to cart"
                  onClick={(e) => handleClickOption(e, "CART")}
                >
                  <SelectOption icon={<BsFillCartPlusFill />} />
                </span>
              )}
              <span
                title="Add to whishlist"
                onClick={(e) => handleClickOption(e, "WHISHLIST")}
              >
                <SelectOption icon={<AiFillHeart color={current?.wishlist?.some(item => item?._id === pid) ? 'red' : ''}/>} />
              </span>
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
            }
            alt=""
            className="w-[274px] h-[274px] object-contain"
          />
          {!normal && (
            <img
              src={isNew ? labelYellow : labelEmerald}
              alt=""
              className={`absolute w-[100px] h-[35px] top-[0px] right-[0px] object-contain`}
            />
          )}
          {!normal && (
            <span
              className={`font-semibold absolute text-white ${
                isNew
                  ? "top-[5px] right-[22px]"
                  : "top-[8px] right-[4px] text-sm"
              }`}
            >
              {isNew ? "NEW" : "TRENDING"}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRating)?.map(
              (el, index) => (
                <span key={index}>{el}</span>
              )
            )}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(Product));
