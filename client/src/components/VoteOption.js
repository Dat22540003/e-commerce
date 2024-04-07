import React, { memo, useRef, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { voteOptions } from "../utils/contants";
import { AiFillStar } from "react-icons/ai";
import { Button } from "./";

const VoteOption = ({ productName, handleSubmitVoteOption }) => {
  const modalRef = useRef();

  const [chosenScore, setChosenScore] = useState(null)

  const [comment, setComment] = useState('')

  const [score, setScore] = useState(null)

  useEffect(() => {
    modalRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={modalRef}
      className="bg-white w-[700px] p-4 flex flex-col gap-4 items-center justify-center"
    >
      <img src={logo} alt="logo" className="w-[300px] py-8 object-contain" />
      <h2 className="text-center text-lg">{`Please review our item of ${productName}`}</h2>
      <textarea
        placeholder="Type somthing"
        className="form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gay-500 text-sm"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div className="w-full flex flex-col gap-4">
        <p>How to you feel about this item?</p>
        <div className="flex items-center justify-center gap-4">
          {voteOptions.map((el) => (
            <div
              className="w-[100px] h-[100px] bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md p-4 flex flex-col items-center justify-center gap-2"
              key={el.id}
              onClick={() => {
                setChosenScore(el.id)
                setScore(el.id)
              }}
            >
              {(Number(chosenScore) && chosenScore >= el.id)? <AiFillStar color="orange" /> : <AiFillStar color="gray" />}
              <span>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <Button handleOnClick={() => handleSubmitVoteOption({comment, score})} fw>Submit</Button>
    </div>
  );
};

export default memo(VoteOption);
