import React, { useState, useEffect, memo } from "react";
import icons from "../utils/icons";
import { apiGetProducts } from "../apis";
import {
  formatMoney,
  renderStarFromNumber,
  secondsToHms,
} from "../utils/helpers";
import { Countdown } from "./";
const moment = require("moment");

const { AiFillStar, IoMenu } = icons;
let idInterval;

const DailyDeal = () => {
  const [dailyDeal, setDailyDeal] = useState(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [expiredTime, setExpiredTime] = useState(false);

  const fetchDailyDeal = async () => {
    const response = await apiGetProducts({
      limit: 1,
      page: Math.round(Math.random() * 10),
      totalRating: 5,
    });
    if (response.success) {
      setDailyDeal(response.productData[0]);
      const today = `${moment().format("MM/DD/YYYY")} 7:00:00`;
      const seconds =
        new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000;
      const number = secondsToHms(seconds);

      setHours(number.h);
      setMinutes(number.m);
      setSeconds(number.s);
    } else {
      setHours(0);
      setMinutes(59);
      setSeconds(59);
    }
  };

  // useEffect(() => {
  //   fetchDailyDeal();
  // }, []);

  useEffect(() => {
    idInterval && clearInterval(idInterval);
    fetchDailyDeal();
  }, [expiredTime]);

  useEffect(() => {
    idInterval = setInterval(() => {
      if (seconds > 0) setSeconds((prev) => prev - 1);
      else {
        if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          if (hours > 0) {
            setHours((prev) => prev - 1);
            setMinutes(59);
            setSeconds(59);
          } else {
            setExpiredTime(!expiredTime);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, [seconds, minutes, hours, expiredTime]);

  return (
    <div className="border w-full flex-auto">
      <div className="w-full flex items-center justify-between p-2">
        <span className="flex-1 flex justify-center">
          <AiFillStar size={20} color="#dd1111" />
        </span>
        <span className="flex-8 font-semibold text-[20px] text-center flex justify-center text-gray-700">
          DAILY DEALS
        </span>
        <span className="flex-1"></span>
      </div>
      <div className="w-full flex flex-col items-center px-4 gap-2">
        <img
          src={
            dailyDeal?.thumb ||
            "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
          }
          alt=""
          className="w-full object-containn py-8"
        />
        <span className="line-clamp-1 text-center">{dailyDeal?.title}</span>
        <span className="flex h-4">
          {renderStarFromNumber(dailyDeal?.totalRating, 20)?.map(
            (el, index) => (
              <span key={index}>{el}</span>
            )
          )}
        </span>
        <span>{`${formatMoney(dailyDeal?.price)} VND`}</span>
      </div>
      <div className="px-4 mt-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Countdown unit={"Hours"} number={hours} />
          <Countdown unit={"Minutes"} number={minutes} />
          <Countdown unit={"Seconds"} number={seconds} />
        </div>

        <button
          type="button"
          className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2"
        >
          <IoMenu />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
};

export default memo(DailyDeal);
