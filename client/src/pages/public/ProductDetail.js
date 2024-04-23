import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createSearchParams, useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts, apiUpdateCart } from '../../apis';
import {
  Breadcrumb,
  Button,
  SelectQuantity,
  ProductExtraInfoItem,
  ProductInformation,
  CustomSlider,
} from '../../components';
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
import {
  formatMoney,
  formatPrice,
  renderStarFromNumber,
} from '../../utils/helpers';
import { productExtraInfomation } from '../../utils/contants';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import path from 'utils/path';
import withBase from 'hocs/withBase';
import { getCurrent } from 'store/user/asyncActions';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const ProductDetail = ({ isQuickView, data, navigate, location, dispatch }) => {
  const titleRef = useRef(null);

  const { current } = useSelector((state) => state.user);

  const params = useParams();

  const [product, setProduct] = useState(null);

  const [currentImage, setCurrentImage] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [relatedProducts, setRelatedProducts] = useState(null);

  const [updateVote, setUpdateVote] = useState(false);

  const [variant, setVariant] = useState(null);

  const [pid, setPid] = useState(null);

  const [category, setCategory] = useState(null);

  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    thumb: '',
    price: '',
    color: '',
    images: [],
  });

  useEffect(() => {
    if (data) {
      setPid(data?.pid);
      setCategory(data?.category);
    } else if (params) {
      setPid(params?.pid);
      setCategory(params?.category);
    }
  }, [data, params]);

  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) {
      setProduct(response.productData);
      setCurrentImage(response?.productData?.thumb);
    }
  };

  useEffect(() => {
    if (variant) {
      setCurrentProduct({
        title: product?.variant?.find((el) => el.sku === variant)?.title,
        thumb: product?.variant?.find((el) => el.sku === variant)?.thumb,
        color: product?.variant?.find((el) => el.sku === variant)?.color,
        price: product?.variant?.find((el) => el.sku === variant)?.price,
        images: product?.variant?.find((el) => el.sku === variant)?.images,
      });
      setCurrentImage(
        product?.variant?.find((el) => el.sku === variant)?.thumb
      );
    } else {
      setCurrentProduct({
        title: '',
        thumb: '',
        price: '',
        color: '',
        images: [],
      });
      setCurrentImage(product?.thumb);
    }
  }, [variant, product]);

  const fetchProducts = async () => {
    const response = await apiGetProducts({ category });
    if (response.success) {
      setRelatedProducts(response.productData);
    }
  };

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0);
    titleRef?.current?.scrollIntoView({ block: 'center'});
  }, [pid]);

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [updateVote]);

  const reRenderVote = useCallback(() => {
    setUpdateVote(!updateVote);
  }, [updateVote]);

  const handleQuantity = useCallback(
    (number) => {
      if (!Number(number) || Number(number) < 1) {
        return;
      } else {
        setQuantity(Number(number));
      }
    },
    [quantity]
  );

  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === 'minus' && quantity === 1) {
        return;
      }
      if (flag === 'minus') {
        setQuantity((prev) => +prev - 1);
      }
      if (flag === 'plus') {
        setQuantity((prev) => +prev + 1);
      }
    },
    [quantity]
  );

  const handleClickImage = (e, el) => {
    e.stopPropagation();
    setCurrentImage(el);
  };

  const handleAddToCart = async () => {
    if (!current) {
      return Swal.fire({
        title: 'Oops!',
        text: 'Please login to continue!',
        icon: 'info',
        showConfirmButton: true,
        confirmButtonText: 'Go to login page',
        showCancelButton: true,
        cancelButtonText: 'Not now',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location?.pathname,
            }).toString(),
          });
        }
      });
    }
    const response = await apiUpdateCart({
      pid: pid,
      color: currentProduct?.color || product?.color,
      quantity,
      price: currentProduct?.price || product?.price,
      thumbnail: currentProduct?.thumb || product?.thumb,
      title: currentProduct?.title || product?.title,
    });
    if (response?.success) {
      toast.success(response?.message);
      dispatch(getCurrent());
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <div className='w-full'>
      {!isQuickView && (
        <div className='h-[81px] bg-gray-100  flex items-center justify-center'>
          <div className='w-main'>
            <h3 ref={titleRef} className='font-semibold'>
              {currentProduct?.title || product?.title}
            </h3>
            <Breadcrumb
              title={currentProduct?.title || product?.title}
              category={category}
            />
          </div>
        </div>
      )}
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'bg-white m-auto mt-4 flex',
          isQuickView
            ? 'max-w-[956px] gap-[120px] p-2 max-h-[83vh] overflow-y-auto'
            : 'w-main'
        )}
      >
        <div
          className={clsx('w-2/5 flex flex-col gap-4', isQuickView && 'w-1/2')}
        >
          <div className='h-[458px] flex items-center w-[458px] border'>
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: 'small image',
                  // isFluidWidth: true,
                  src: currentImage,
                  width: 456,
                  height: 456,
                },
                largeImage: {
                  src: currentImage,
                  width: 1800,
                  height: 1800,
                },
                imageStyle: { objectFit: 'contain' },
              }}
            />
          </div>
          <div className='w-[458px]'>
            <Slider {...settings} className='image-slider'>
              {currentProduct?.images?.length === 0 &&
                product?.images?.map((el, index) => (
                  <div
                    key={index}
                    className='flex w-full justify-between mx-[3px]'
                  >
                    <img
                      src={el}
                      alt='sub-product'
                      className={clsx(
                        'h-[143px] w-[143px] object-contain border cursor-pointer',
                        currentImage === el && 'border-main'
                      )}
                      onClick={(e) => handleClickImage(e, el)}
                    />
                  </div>
                ))}

              {currentProduct?.images?.length > 0 &&
                currentProduct?.images?.map((el, index) => (
                  <div
                    key={index}
                    className='flex w-full justify-between mx-[3px]'
                  >
                    <img
                      src={el}
                      alt='sub-product'
                      className={clsx(
                        'h-[143px] w-[143px] object-contain border cursor-pointer',
                        currentImage === el && 'border-main'
                      )}
                      onClick={(e) => handleClickImage(e, el)}
                    />
                  </div>
                ))}
            </Slider>
          </div>
        </div>
        <div
          className={clsx(
            'w-2/5 pr-6 flex flex-col gap-4',
            isQuickView && 'w-1/2'
          )}
        >
          <div className='flex items-center justify-between'>
            <h2 className='text-[30px] font-semibold'>{`${formatMoney(
              formatPrice(currentProduct?.price || product?.price)
            )} VND`}</h2>
            <span className='text-sm text-main'>{`In stock: ${product?.quantity} item(s)`}</span>
          </div>
          <div className='flex items-center gap-1'>
            {renderStarFromNumber(product?.totalRating)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className='text-sm text-main italic'>{`(Sold: ${product?.sold} item(s))`}</span>
          </div>
          <ul className='list-square text-sm text-gray-500 pl-4'>
            {product?.description?.length > 1 &&
              product?.description?.map((el, index) => (
                <li key={index} className='leading-6'>
                  {el}
                </li>
              ))}
            {product?.description?.length === 1 && (
              <div
                className='text-sm line-clamp-[10] mb-8'
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description[0]),
                }}
              ></div>
            )}
          </ul>
          <div className='my-4 flex gap-4'>
            <span className='font-semibold'>Color:</span>
            <div className='flex flex-wrap gap-4 items-center w-full'>
              <div
                onClick={() => setVariant(null)}
                className={clsx(
                  'flex items-center gap-2 p-2 border cursor-pointer',
                  !variant && 'border-main'
                )}
              >
                <img
                  src={product?.thumb}
                  alt='thumb'
                  className='w-8 h-8 rounded-md object-contain'
                />
                <span className='flex flex-col'>
                  <span className='text-xs'>{product?.color}</span>
                  <span className='text-xs'>{product?.price}</span>
                </span>
              </div>
              {product?.variant?.map((el) => (
                <div
                  key={el.sku}
                  onClick={() => setVariant(el.sku)}
                  className={clsx(
                    'flex items-center gap-2 p-2 border cursor-pointer',
                    variant === el.sku && 'border-main'
                  )}
                >
                  <img
                    src={el?.thumb}
                    alt='thumb'
                    className='w-8 h-8 rounded-md object-contain'
                  />
                  <span className='flex flex-col'>
                    <span className='text-xs'>{el?.color}</span>
                    <span className='text-xs'>{el?.price}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-4'>
              <span className='font-semibold'>Quantity:</span>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
            <Button handleOnClick={handleAddToCart} fw>
              Add to cart
            </Button>
          </div>
        </div>
        {!isQuickView && (
          <div className='w-1/5'>
            {productExtraInfomation?.map((el) => (
              <ProductExtraInfoItem
                key={el.id}
                icon={el.icon}
                title={el.title}
                sub={el.sub}
              />
            ))}
          </div>
        )}
      </div>
      {!isQuickView && (
        <div className='w-main m-auto mt-8'>
          <ProductInformation
            totalRating={product?.totalRating}
            ratings={product?.ratings}
            productName={product?.title}
            pid={product?._id}
            reRenderVote={reRenderVote}
          />
        </div>
      )}
      {!isQuickView && (
        <>
          <div className='w-main m-auto mt-8'>
            <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>
              OTHER CUSTOMERS ALSO BUY
            </h3>
            <div className='mt-4 mx-[-10px]'>
              <CustomSlider normal={true} products={relatedProducts} />
            </div>
          </div>
          <div className='h-[100px] w-full'></div>
        </>
      )}
    </div>
  );
};

export default withBase(memo(ProductDetail));
