import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import AppSetting from "../components/AppSetting";
import Menu from "../components/Menu";

function Layout({ children }) {
  // Implement data fetching using useEffect if needed

  return (
    <div id="root"  className="layout-container" >
      
      <Header />
      <Menu />
     
      <div  className="content-container" >{children}</div>
      <Footer></Footer>
  
    </div>
  );
}

export default Layout;
