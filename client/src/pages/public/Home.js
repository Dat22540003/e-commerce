import React from "react";
import {
  Sidebar,
  Banner,
  BestSeller,
  DailyDeal,
  FeaturedProduct,
  CustomSlider,
} from "../../components";
import { useSelector } from "react-redux";
import icons from "../../utils/icons";
import withBase from "hocs/withBase";
import { createSearchParams } from "react-router-dom";

const { GrFormNext } = icons;

const Home = ({ navigate }) => {
  const { newProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.app);
  const { isLoggedIn, current } = useSelector((state) => state.user);

  return (
    <>
      <div className="w-main flex mt-6">
        <div className="flex flex-col gap-5 w-[25%] flex-auto">
          <Sidebar />
          <DailyDeal />
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className="my-8">
        <FeaturedProduct />
      </div>
      <div className="my-8 w-main">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          NEW ARRIVALS
        </h3>
        <div className="mt-4 mx-[-10px]">
          <CustomSlider products={newProducts} />
        </div>
      </div>
      <div className="my-8 w-main">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          HOT COLLECTIONS
        </h3>
        <div className="flex flex-wrap mt-2 mx-[-8px]">
          {categories
            ?.filter((el) => el.brand.length > 0)
            ?.map((el) => (
              <div key={el._id} className="w-1/3 p-2">
                <div className="border p-4 flex gap-4 min-h-[180px]">
                  <img
                    src={el.image}
                    alt=""
                    className="flex-1 w-[144px] h-[129px] object-contain"
                  />
                  <div className="flex-1 text-gray-700">
                    <h4 className="font-semibold uppercase">{el?.title}</h4>
                    <ul className="text-sm">
                      {el?.brand.map((item, index) => (
                        <span
                          key={index}
                          className="flex gap-1 items-center text-gray-500 cursor-pointer hover:text-main hover:underline"
                          onClick={() =>
                            navigate({
                              pathname: `/${el?.title}`,
                              search: createSearchParams({
                                brand: item,
                              }).toString(),
                            })
                          }
                        >
                          <GrFormNext size={14} />
                          <li>{item}</li>
                        </span>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="my-8 w-main">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          BLOG POSTS
        </h3>
      </div>
    </>
  );
};

export default withBase(Home);
