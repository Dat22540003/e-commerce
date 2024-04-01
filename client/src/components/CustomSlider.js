import React, { memo } from "react";
import Slider from "react-slick";
import { Product } from "./";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const CustomSlider = ({ products, activeTab }) => {
  return (
    <>
      {products && (
        <Slider {...settings} className='custom-slider'>
          {products?.map((el) => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              isNew={activeTab === 2 ? true : false}
            />
          ))}
        </Slider>
      )}
    </>
  );
};

export default memo(CustomSlider);
