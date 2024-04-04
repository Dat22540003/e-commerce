import React, { memo } from 'react'

const InputSelect = ({value, changedValue, options}) => {
  return (
    <select className='form-select text-xs text-gray-500' value={value} onChange={e => changedValue(e.target.value)}>
      <option value=''>Default</option>
      {options?.map(el => (
        <option key={el.id} value={el.value}>{el.text}</option>
      ))}
    </select>
  )
}

export default memo(InputSelect)