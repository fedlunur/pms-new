import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext.js";
import { AiFillDashboard, AiFillProject } from "react-icons/ai";
import { RiTeamFill } from "react-icons/ri";
import { ImAttachment } from "react-icons/im";
import { GrProjects, GrTasks } from "react-icons/gr";
import logo from "../images/logopms.png"; // Ensure the path is correct

export default function Menu() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const nav_links = [
    { to: "/dashboard", icon: <AiFillDashboard />, text: "Dashboard" },
    { to: "/projectsDashboard", icon: <AiFillProject />, text: "Projects" },
    { to: "/calendar", icon: <i className="nav-icon far fa-calendar-alt" />, text: "Events" },
    { to: "/taskdt", icon: <GrTasks />, text: "Tasks" },
    { to: "/attachments", icon: <ImAttachment />, text: "Attachments" },
    { to: "/projectdetails", icon: <GrProjects />, text: "Project Details" },
    { to: "/ganttchart", icon: <GrProjects />, text: "Gantt Chart" },
  ];

  return (
    <div>
      <aside className="bg-white h-full main-sidebar px-2 py-2 w-1/6 ">
      <div>
        <div className="w-[90%] h-[80px]">
          <img src={logo} alt="logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-xl font-light text-center text-blue-800 mt-2">PMS</h1>
        </div>
        <nav className="mx-2 mt-12 text-base flex flex-col h-full">
          <ul className="space-y-3">
            {nav_links.map(({ to, icon, text }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`nav-link flex gap-2 items-center px-3 py-2 rounded-md transition-colors duration-300 ${
                    location.pathname === to
                      ? "bg-blue-100 text-blue-600 border border-blue-500 font-bold"
                      : "hover:bg-blue-50 hover:text-blue-500"
                  }`}
                >
                  {icon}
                  <p>{text}</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
