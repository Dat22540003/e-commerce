import React, { memo } from "react";
import clsx from "clsx";
import { useSearchParams, useNavigate, createSearchParams, useLocation } from "react-router-dom";

const PaginationItem = ({ children }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePagination = () => {
    const queries = Object.fromEntries([...params]);
    console.log(queries)
    if (Number(children)) {
      queries.page = children;
    }

    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString(),
    })
  };

  return (
    <button
      className={clsx(
        "w-10 h-10 flex justify-center ",
        !Number(children) && "items-end pb-2",
        Number(children) && "items-center hover:rounded-full hover:bg-gray-300",
        +params.get("page") === +children && "rounded-full bg-gray-300",
        !+params.get("page") && children === 1 && "rounded-full bg-gray-300",
      )}
      onClick={handlePagination}
      type="button"
      disabled={!Number(children)}
    >
      {children}
    </button>
  );
};

export default memo(PaginationItem);
