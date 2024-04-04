import React, { memo, useState } from "react";
import { productInfoTabs } from "../utils/contants";

const activeStyle = "";
const deactiveStyle = "";

const ProductInformation = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div>
      <div className="flex items-center gap-2 relative bottom-[-0.5px]">
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
    </div>
  );
};

export default memo(ProductInformation);
