// import logo from "./logo.svg";
//import routes
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//pribvate route
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Loginpage from "./views/accounts/Loginpage";
import Registerpage from "./views/accounts/Registerpage";
import "react-datepicker/dist/react-datepicker.css"; 

import TaskList from "./views/TaskList";

import ProjectListDT from "./views/ProjectsListDT";
import DashboardLTE from "./components/DashboardLTE";
import ProjectsDashboard from "./components/ProjectsDashboard";
import ActivityBoardList from "./components/Activity/ActivityBoardList";

import Taskdetail from "./components/Activity/TaskDetail/Taskdetail";

import Calendar from "./components/Calendar";
import IssuePage from "./views/issues/IssuePage";
import IssueDetailPage from "./views/issues/IssueDetail";
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'primereact/resources/themes/saga-blue/theme.css'; // or any other theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import TaskAttachmentList from "./components/FileManagment/TaskAttachmentList";

import Taksperday from "./components/Reports/Taskperday";
import ProjectDetails from "./components/ProjectDetails";

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
          <PrivateRoute
            component={ProjectDetails}
            path="/projectdetails"
            exact
          />

          <Route component={Loginpage} path="/" exact/>
          <Route component={Registerpage} path="/register" exact />
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
          <Route 
          path="/issues/:taskId" 
          exact 
          component={IssuePage} 
        />
        <Route 
          path="/issues/detail/:id" 
          exact 
          component={IssueDetailPage} 
        />

          <Route component={Calendar} path="/calendar" exact />
          <Route component={Taskdetail} path="/taskdt" exact />

          <Route component={TaskAttachmentList} path="/attachments" exact />
          <Route component={Taksperday} path="/charts" exact />
          
       
        </Switch>
        </PrimeReactProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
