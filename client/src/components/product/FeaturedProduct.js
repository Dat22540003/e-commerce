import React, { memo, useEffect, useState } from "react";
import { ProductCard } from "components";
import { apiGetProducts } from "apis";

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await apiGetProducts({
      limit: 9,
      sort: "-totalRating",
    });
    if (response.success) setProducts(response.productData);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="w-main">
      <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
        FEATURED PRODUCTS
      </h3>
      <div className="flex flex-wrap mt-[15px] mx-[-10px]">
        {products?.map((el) => (
          <ProductCard
            key={el?._id}
            pid={el?._id}
            // thumb={el.thumb}
            // title={el.title}
            // price={el.price}
            // totalRating={el.totalRating}
            {...el}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-4">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-2 row-span-2"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-2"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        />
      </div>
    </div>
  );
};

export default memo(FeaturedProduct);
