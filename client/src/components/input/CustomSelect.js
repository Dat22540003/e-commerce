import clsx from "clsx";
import React from "react";
import Select from "react-select";

const CustomSelect = ({
  label,
  placeholder,
  onChange,
  options = [],
  value,
  style,
  wrapClassName,
}) => {
  return (
    <div className={clsx(wrapClassName)}>
      {label && <h3>{label}</h3>}
      <Select
        options={options}
        isClearable
        placeholder={placeholder}
        value={value}
        isSearchable
        onChange={(val) => onChange(val)}
        formatOptionLabel={(option) => 
          <div className="flex items-center gpa-2">
            <span>{option.label}</span>
          </div>
        }
        className={{ control: () => clsx("border-2 py-[2px]", style) }}
      />
    </div>
  );
};

export default CustomSelect;
