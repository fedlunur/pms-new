import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext.js";
import { AiFillDashboard, AiFillProject } from "react-icons/ai";
import { RiTeamFill } from "react-icons/ri";
import { ImAttachment } from "react-icons/im";
import { GrProjects, GrTasks } from "react-icons/gr";
import { Menu } from "antd";
import logo from "../images/logoblack.png"; // Ensure the path is correct

const { SubMenu } = Menu;

export default function SideMenu() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <div>
      <aside className="bg-white h-full main-sidebar px-2 py-2 w-1/6">
        <div>
          <div className="w-[90%] h-[200px]">
            <img src={logo} alt="logo" className="w-full h-full object-contain" />
          </div>
          {/* <h1 className="text-xl font-light text-center text-blue-800 mt-2">PMS</h1> */}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className="h-full"
        >
          <Menu.Item key="/dashboard" icon={<AiFillDashboard />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/projectsDashboard" icon={<AiFillProject />}>
            <Link to="/projectsDashboard">Projects</Link>
          </Menu.Item>
          <Menu.Item key="/calendar" icon={<i className="nav-icon far fa-calendar-alt" />}>
            <Link to="/calendar">Events</Link>
          </Menu.Item>
          <Menu.Item key="/taskdt" icon={<GrTasks />}>
            <Link to="/taskdt">Tasks</Link>
          </Menu.Item>
          <SubMenu key="resources" icon={<ImAttachment />} title="Resources">
            <Menu.Item key="/resources">
              <Link to="/resources">Project Resources</Link>
            </Menu.Item>
            {/* <Menu.Item key="/attachments">
              <Link to="/attachments">Task Resources</Link>
            </Menu.Item> */}
          </SubMenu>
          <Menu.Item key="/projectdetails" icon={<GrProjects />}>
            <Link to="/projectdetails">Project Details</Link>
          </Menu.Item>
          <Menu.Item key="/ganttchart" icon={<GrProjects />}>
            <Link to="/ganttchart">Gantt Chart</Link>
          </Menu.Item>
        </Menu>
      </aside>
    </div>
  );
}
