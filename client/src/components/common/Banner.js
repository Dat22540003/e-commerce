import React, { memo } from "react";
import banner from 'assets/banner.png'

const Banner = () => {
  return (
    <div className="w-full">
      <img
        src={banner}
        alt="banner"
        className="h-[393.33px] w-main object-cover"
      />
    </div>
  );
};

export default memo(Banner);
