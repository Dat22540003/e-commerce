import { useMemo } from "react";
import {generateRange} from '../utils/helpers'
import {BsThreeDots} from 'react-icons/bs'

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
    const paginationArray = useMemo(() => {
        const pageSize = +process.env.REACT_APP_LIMIT || 10;
        const paginationCount = Math.ceil(+totalProductCount / pageSize);
        const totalPaginationItem = +siblingCount + 5;

        if(paginationCount <= totalPaginationItem) {
            return generateRange(1, paginationCount)
        }

        const isShowLeftDots = currentPage - siblingCount > 2;
        const isShowRightDots = currentPage + siblingCount < paginationCount - 1;

        if(isShowLeftDots && !isShowRightDots) {
            const rightStart = paginationCount - 4;
            const rightRange = generateRange(rightStart, paginationCount);
            return [1, <BsThreeDots/>, ...rightRange];
        }

        if(!isShowLeftDots && isShowRightDots) {
            const leftRange = generateRange(1, 5);
            return [...leftRange, <BsThreeDots/>, paginationCount];
        }

        const siblingLeft = Math.max(currentPage - siblingCount, 1);
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount);

        if(isShowLeftDots && isShowRightDots){
            const middleRange = generateRange(siblingLeft, siblingRight);
            return [1, <BsThreeDots/>, ...middleRange, <BsThreeDots/>, paginationCount];
        }

    },[totalProductCount, currentPage, siblingCount])
   return paginationArray;
};

export default usePagination;

// first + last + curent + sibling + 2 * dots
// min = 6 => sibling + 5
// totalPagination: 58, limitProduct = 10 => = 5.8 = 6
// totalPaginationItem: sibling + 5 = 6
// sibling = 1

// [1, 2, 3, 4, 5, 6]
// [1,...,6,7,8,9,10]
// [1,2,3,4,5,...,10]
// [1, ...,5,6,7, ..., 10]
