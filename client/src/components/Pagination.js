import React from "react";
import usePagination from "../hooks/usePagination";
import { PaginationItem } from "./";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalCount, productNumber }) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, 2);
  const range = () => {
    const currentPage = +params.get("page");
    const pageSize = +process.env.REACT_APP_PRODUCT_LIMIT || 10;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start} to ${end}`;
  };
  return (
    <div className="flex w-main justify-between">
      {!+params.get("page") ? (
        <span className="text-sm italic">{`Products from 1 to ${
          process.env.REACT_APP_PRODUCT_LIMIT || 10
        } of ${totalCount} item(s)`}</span>
      ) : (
        <span className="text-sm italic">{`Products from ${range()} of ${totalCount} item(s)`}</span>
      )}
      <div className="flex items-center">
        {pagination?.map((el) => (
          <PaginationItem key={el}>{el}</PaginationItem>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
