import React, { useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppSetting from "../components/AppSetting";
import Menu from "../components/Menu";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../context/AuthContext";


function Layout({ children }) {

  return (
    <div className="flex w-screen h-screen bg-blue-50">
      <div className="flex-none w-1/6">
        <Menu />
      </div>
      <div className="flex-1 flex flex-col">
        <Header className="bg-white p-2 shadow" />
        <main className="flex-1  p-4 bg-blue-50 overflow-y-auto">
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default Layout;
