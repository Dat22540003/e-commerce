import React, { memo } from "react";
import clsx from "clsx";

const Select = ({
  label,
  options = [],
  register,
  errors,
  id,
  validate,
  style,
  fullWidth,
  defaultValue,
}) => {
  return (
    <div className={clsx("flex flex-col gap-2", style)}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        defaultValue={defaultValue}
        id={id}
        {...register(id, validate)}
        className={clsx("form-select max-h-[42px]", fullWidth && "w-full", style)}
      >
        <option value="">--CHOOSE--</option>
        {options.map((el) => (
          <option value={el.code}>{el.value}</option>
        ))}
      </select>
      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(Select);
