import React, {memo} from 'react'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { pid, title } = useParams();
  
  return (
    <div>ProductDetail</div>
  )
}

export default memo(ProductDetail)