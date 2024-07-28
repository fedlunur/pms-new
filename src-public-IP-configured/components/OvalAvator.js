import React from "react";

function OvalAvatar({ firstName, fatherName }) {
  // Extracting the first letters
  const firstNameInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const fatherNameInitial = fatherName
    ? fatherName.charAt(0).toUpperCase()
    : "";

  return (
    <div className="oval-avatar">
      <div className="initial">{firstNameInitial}</div>
      <div className="initial">{fatherNameInitial}</div>
    </div>
  );
}

export default OvalAvatar;
