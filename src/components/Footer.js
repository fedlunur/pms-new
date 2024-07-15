import React from "react";

export default function Footer() {

  return (
    <div style={{bottom:5}}>
      <footer className="main-footer">
        <div className="float-right d-none d-sm-inline-block">
          Copyright © {new Date().getFullYear()} <a href="#">CDHI-PMS</a>.
        </div>
      </footer>
    </div>
  );
}
