import React, { memo } from 'react';
import usePagination from 'hooks/usePagination';
import { PaginationItem } from 'components';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx'

const Pagination = ({ totalCount}) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, +params.get('page') || 1);
  const range = () => {
    const currentPage = +params.get('page');
    const pageSize = +process.env.REACT_APP_LIMIT || 10;
    const start = Math.min((currentPage - 1) * pageSize + 1, totalCount);
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start} to ${end}`;
  };
  return (
    <div className= 'flex w-full justify-between items-center'>
      {!+params.get('page') ? (
        <span className='text-sm italic'>{`Products from ${Math.min(totalCount, 1)} to ${
          Math.min(totalCount, +process.env.REACT_APP_LIMIT)
        } of ${totalCount} item(s)`}</span>
      ) : (
        <span className='text-sm italic'>{`Products from ${range()} of ${totalCount} item(s)`}</span>
      )}
      <div className='flex items-center'>
        {pagination?.map((el) => (
          <PaginationItem key={el}>{el}</PaginationItem>
        ))}
      </div>
    </div>
  );
};

export default memo(Pagination);
