import React, { memo, useEffect, useState } from "react";
import icons from "../utils/icons";
import { colors } from "../utils/contants";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { apiGetProducts } from "../apis";
import useDebounce from '../hooks/useDebounce'

const { AiOutlineDown } = icons;

const SearchItem = ({
  name,
  activeClick,
  changeActiveFilter,
  type = "checkbox",
}) => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const { category } = useParams();
  const [highestPrice, setHighestPrice] = useState(null);
  const [price, setPrice] = useState({
    from: '',
    to: '',
  });

  const handleCheckboxSelect = (e) => {
    changeActiveFilter(null);
    const alreadySelected = selected.find((el) => el === e.target.value);
    if (alreadySelected) {
      setSelected((prev) => prev.filter((el) => el !== e.target.value));
    } else {
      setSelected((prev) => [...prev, e.target.value]);
    }
  };

  const fetchHighestPrice = async () => {
    const response = await apiGetProducts({ sort: "-price", limit: 1 });
    if (response?.success) {
      setHighestPrice(response.productData[0]?.price);
    }
  };

  useEffect(() => {
    if (selected.length > 0) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({
          color: selected.join(","),
        }).toString(),
      });
    } else {
      navigate(`/${category}`);
    }
  }, [selected]);

  useEffect(() => {
    if (type === "input") {
      fetchHighestPrice();
    }
  }, [type]);

  useEffect(() => {
    if(price.from > price.to){
      alert('From price must be less than To price');
    }
  },[price]);

  const debouncePriceFrom = useDebounce(price.from, 500);
  const debouncePriceTo = useDebounce(price.to, 500);
  useEffect(() => {
    const data={};
    if(Number(price.from) > 0){
      data.from = price.from;
    }
    if(Number(price.to) > 0){
      data.to = price.to;
    }
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(data).toString(),
    });
  }, [debouncePriceFrom, debouncePriceTo]);

  return (
    <div
      className="p-3 cursor-pointer text-gray-500 gap-6 text-xs relative border border-gray-500 flex justify-center items-center"
      onClick={() => changeActiveFilter(name)}
    >
      <span className="capitalize">{name}</span>
      <AiOutlineDown />
      {activeClick === name && (
        <div className="absolute z-10 top-[calc(100%+1px)] left-[-0.5px] w-fit p-4 border bg-white min-w-[150px]">
          {type === "checkbox" && (
            <div className="">
              <div className="pb-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                <span
                  className="underline cursor-pointer hover:text-main"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected([]);
                  }}
                >
                  Reset
                </span>
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-3 mt-4"
              >
                {colors.map((el, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      value={el}
                      onChange={handleCheckboxSelect}
                      id={el}
                      checked={selected.some(
                        (selectedItem) => selectedItem === el
                      )}
                    />
                    <label className="capitalize text-gray-700" htmlFor={el}>
                      {el}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "input" && (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="pb-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">{`The highest price is ${Number(
                  highestPrice
                ).toLocaleString()} VND`}</span>
                <span
                  className="underline cursor-pointer hover:text-main"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrice({from: '', to: ''});
                    changeActiveFilter(null);
                  }}
                >
                  Reset
                </span>
              </div>
              <div className="flex items-center p-2 gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="from">From</label>
                  <input
                    value={price.from}
                    onChange={(e) =>
                      setPrice((prev) => ({ ...prev, from: e.target.value }))
                    }
                    className="form-input"
                    type="number"
                    id="from"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="to">To</label>
                  <input
                    value={price.to}
                    onChange={(e) =>
                      setPrice((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="form-input"
                    type="number"
                    id="to"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItem);
