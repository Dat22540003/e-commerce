import React, { memo } from "react";
import clsx from "clsx";

const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidFields,
  setInvalidFields,
  style,
  fw,
  placeholder,
  isHideLabel,
}) => {
  return (
    <div className={clsx("relative flex flex-col mb-2", fw && "w-full")}>
      {!isHideLabel && value?.trim() !== "" && (
        <label
          className="text-[10px] animate-slide-top-sm absolute top-0 left-[12px] block bg-white px-1"
          htmlFor={nameKey}
        >
          {placeholder || nameKey?.charAt(0).toUpperCase() + nameKey?.slice(1)}
        </label>
      )}
      <input
        type={type || "text"}
        className={clsx(
          style ? `${style} px-4 py-2 rounded-smborder mt-2 placeholder:italic outline-none` : "px-4 py-2 rounded-sm w-full border mt-2 placeholder:text-sm placeholder:italic outline-none"
        )}
        placeholder={placeholder || nameKey?.charAt(0).toUpperCase() + nameKey?.slice(1)}
        value={value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
        }
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />
      {invalidFields?.some((el) => el.name === nameKey) && (
        <small className="text-main text-[10px] italic">
          {invalidFields?.find((el) => el.name === nameKey)?.message}
        </small>
      )}
    </div>
  );
};

export default memo(InputField);
