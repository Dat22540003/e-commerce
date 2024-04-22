import withBase from 'hocs/withBase'
import { CartDetail } from 'pages/public'
import React from 'react'

const MyCart = () => {
  return (
    <div className='px-2'>
      <CartDetail/>
    </div>
  )
}

export default withBase(MyCart)