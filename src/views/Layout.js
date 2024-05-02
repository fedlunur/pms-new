import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardLTE from "../components/DashboardLTE";
import AppSetting from "../components/AppSetting";
import Menu from "../components/Menu";

function Layout({ children }) {
  // Implement data fetching using useEffect if needed

  return (
    <div>
      <Header />
      <Menu />
      <div>{children}</div>
      <Footer />
      <AppSetting />
    </div>
  );
}

export default Layout;
