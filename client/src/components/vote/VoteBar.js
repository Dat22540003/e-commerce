import React, {useEffect, useRef, memo} from 'react'
import { AiFillStar } from 'react-icons/ai'

const VoteBar = ({number, ratingCount, totalRating}) => {
    const percentRef = useRef()
    useEffect(() => {
        const percent =  Math.round(ratingCount * 100 / totalRating) || 0;
        percentRef.current.style.cssText = `right: ${100 - percent}%`
    }, [ratingCount, totalRating])
  return (
    <div className='flex items-center gap-2 text-sm text-gray-500'>
        <div className='flex w-[10%] items-center justify-center  gap-1'>
            <sapn>{number}</sapn>
            <AiFillStar color='orange'/>
        </div>
        <div className='w-[75%]'>
            <div className='relative w-full h-[6px] bg-gray-200 rounded-l-full rounded-r-full'>
                <div ref={percentRef} className='absolute inset-0 bg-red-500  rounded-l-full rounded-r-full'></div>
            </div>
        </div>
        <div className='w-[15%] flex justify-end text-xs'>
            {`${ratingCount || 0} rating(s)`}
        </div>
    </div>
  )
}

export default memo(VoteBar);