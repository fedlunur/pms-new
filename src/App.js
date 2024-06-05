// import logo from "./logo.svg";
//import routes
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//pribvate route
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

import Homepage from "./views/Homepage";
import Loginpage from "./views/accounts/Loginpage";
import Registerpage from "./views/accounts/Registerpage";


import TaskList from "./views/TaskList";

import ProjectListDT from "./views/ProjectsListDT";
import DashboardLTE from "./components/DashboardLTE";
import ProjectsDashboard from "./components/ProjectsDashboard";
import ActivityBoardList from "./components/Activity/ActivityBoardList";

import Taskdetail from "./components/Activity/TaskDetail/Taskdetail";
import MembersandChat from "./components/Members/members";
import MyTimeTable from "./components/FullCalendar";
import Contents from "./components/Activity/TaskDetail/TableSample";


import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "react-big-calendar/lib/css/react-big-calendar.css";

import TaskAttachmentList from "./components/FileManagment/TaskAttachmentList";
import TaskperDayaBar from "./components/Reports/Taskperday";
import Taksperday from "./components/Reports/Taskperday";

function App() {
  return (
    <Router>
      <AuthProvider>
      <PrimeReactProvider>
        <Switch>
          {/* private means users need to have access to dashboard */}
          <PrivateRoute component={DashboardLTE} path="/dashboard" exact />
          <PrivateRoute
            component={ProjectsDashboard}
            path="/projectsDashboard"
            exact
          />

          <Route component={Loginpage} path="/login" />
          <Route component={Registerpage} path="/register" exact />
          <Route component={Homepage} path="/" exact />
          {/* <Route component={TodoList} path="/todos" exact /> */}
          <Route component={ProjectListDT} path="/project" exact />


          {/* <Route
            component={TaskActivitiesTutorial}
            path="/taskactivitiestutor"
            exact
          /> */}
          <Route component={TaskList} path="/tasklist" exact />
      
          <Route
            component={ActivityBoardList}
            path="/activityboardlist"
            exact
          />

<Route component={MyTimeTable} path="/timetable" exact />
          <Route component={Taskdetail} path="/taskdt" exact />

          {/* <Route component={MembersandChat} path="/membersandchat" exact /> */}
          
          <Route component={Contents} path="/membersandchat" exact />
          
          {/* <Route component={Attachments} path="/attachments" exact /> */}
          <Route component={TaskAttachmentList} path="/attachments" exact />
          <Route component={Taksperday} path="/charts" exact />
          
          {/*Working task list  */}
        </Switch>
        </PrimeReactProvider>
      </AuthProvider>
      
    </Router>
  );
}

export default App;
