import SelectQuantity from 'components/common/SelectQuantity';
import withBase from 'hocs/withBase';
import React, { useEffect, useState } from 'react';
import { updateCart } from 'store/user/userSlice';
import { formatMoney } from 'utils/helpers';

const OrderedItem = ({
    defaultQuantity = 1,
    color,
    price,
    title,
    thumbnail,
    pid,
    dispatch,
}) => {
    const [quantity, setQuantity] = useState(() => +defaultQuantity);

    const handleQuantity = (number) => {
        if (+number > 1) {
            setQuantity(number);
        }
    };

    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) {
            return;
        }
        if (flag === 'minus') {
            setQuantity((prev) => +prev - 1);
        }
        if (flag === 'plus') {
            setQuantity((prev) => +prev + 1);
        }
    };

    useEffect(() => {
        dispatch(updateCart({ pid, quantity, color }));
    }, [quantity]);

    return (
        <div className="w-full mx-auto grid grid-cols-10 border-b py-2">
            <span className="col-span-6 w-full text-center">
                <div className="flex gap-2">
                    <img
                        src={thumbnail}
                        alt="thumb"
                        className="w-28 h-28 object-contain"
                    />
                    <div className="flex flex-col items-start justify-center gap-1">
                        <span className="font-semibold">
                            {title?.toUpperCase()}
                        </span>
                        <span className="capitalize text-xs">
                            {color?.toLowerCase()}
                        </span>
                    </div>
                </div>
            </span>
            <span className="col-span-1 w-full text-center">
                <div className="flex items-center h-full">
                    <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                    />
                </div>
            </span>
            <span className="flex justify-center items-center col-span-3 h-full w-full text-center">
                <span className="">{`${formatMoney(
                    price * quantity,
                )} VND`}</span>
            </span>
        </div>
    );
};

export default withBase(OrderedItem);
