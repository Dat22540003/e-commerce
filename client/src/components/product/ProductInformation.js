import React, { memo, useState, useCallback } from "react";
import { productInfoTabs } from "utils/contants";
import { VoteBar, VoteOption, Button, Comment } from "components";
import { renderStarFromNumber } from "utils/helpers";
import { apiRating } from "apis/product";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "store/app/appSlice";
import Swal from "sweetalert2";
import path from "utils/path";
import { useNavigate } from "react-router-dom";

const ProductInformation = ({
  totalRating,
  ratings,
  productName,
  pid,
  reRenderVote,
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleSubmitVoteOption = async ({ comment, score }) => {
    if (!comment || !score || !pid) {
      alert("Please fill in all fields");
      return;
    }
    await apiRating({ star: score, comment, pid, updatedAt: Date.now()});
    dispatch(
      showModal({
        isShowModal: false,
        modalChildren: null,
      })
    );
    reRenderVote();
  };

  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: "You need to login to vote",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Go to login",
        title: "Oops!",
        icon: "info",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate(`/${path.LOGIN}`);
        }
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOption
              productName={productName}
              handleSubmitVoteOption={handleSubmitVoteOption}
            />
          ),
        })
      );
    }
  };

  return (
    <div>
      <div className="flex relative items-center gap-2 bottom-[-0.5px]">
        {productInfoTabs?.map((el) => (
          <span
            className={`p-2 px-4 cursor-pointe ${
              activeTab === el.id
                ? "bg-white border border-b-0"
                : "bg-gray-200  hover:bg-white border border-b-0"
            }`}
            key={el.id}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>

      <div className="w-full border p-4">
        {productInfoTabs?.some((el) => el.id === activeTab) &&
          productInfoTabs[activeTab - 1].content}
      </div>

      <div className="flex flex-col py-8 w-main">
        <div className="flex border">
          <div className="flex-4 flex flex-col items-center justify-center">
            <span className="font-semibold text-3xl">{`${totalRating}/5`}</span>
            <span className="flex items-center gap-1">
              {renderStarFromNumber(totalRating)?.map((el, index) => (
                <span key={index}>{el}</span>
              ))}
            </span>
            <span className="text-sm">{`${ratings?.length} reviewer(s)`}</span>
          </div>
          <div className="flex-6 flex flex-col gap-2 p-4">
            {Array.from(Array(5).keys())
              .reverse()
              .map((el) => (
                <VoteBar
                  key={el}
                  number={el + 1}
                  ratingCount={
                    ratings?.filter((item) => item.star === el + 1)?.length
                  }
                  totalRating={ratings?.length}
                />
              ))}
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 items-center justify-center text-sm">
          <span>Do you want to review this product?</span>
          <Button handleOnClick={handleVoteNow}>Vote now!</Button>
        </div>
        <div className="flex flex-col gap-4">
          {ratings?.map((el) => (
            <Comment
              key={el._id}
              star={el.star}
              updatedAt={el.updatedAt}
              comment={el.comment} 
              name={`${el?.postedBy?.firstname} ${el?.postedBy?.lastname}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductInformation);
