import React from "react";
import Multiselect from "multiselect-react-dropdown";

const CustomMultiselect = ({
  options,
  selectedValues,
  onSelect,
  onRemove,
  onSearch,
  onKeyPressFn,
  displayValue,
  customCloseIcon,
}) => {
  return (
    <Multiselect
      options={options}
      selectedValues={selectedValues}
      onSelect={onSelect}
      onRemove={onRemove}
      onSearch={onSearch}
      onKeyPressFn={onKeyPressFn}
      displayValue={displayValue}
      customCloseIcon={customCloseIcon}
    />
  );
};

export default CustomMultiselect;
