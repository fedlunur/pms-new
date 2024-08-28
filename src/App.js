import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

import './App.css';

// Views and Components
import Loginpage from './views/accounts/Loginpage';
import Registerpage from './views/accounts/Registerpage';
import TaskList from './views/TaskList';
import ProjectListDT from './views/ProjectsListDT';
import DashboardLTE from './components/DashboardLTE';
import ProjectsDashboard from './components/ProjectsDashboard';
import ActivityBoardList from './components/Activity/ActivityBoardList';
import Taskdetail from './components/Activity/TaskDetail/Taskdetail';
import Calendar from './components/Calendar';

import IssuePage from './views/issues/IssuePage';
import IssueDetailPage from './views/issues/IssueDetail';
import TaskAttachmentList from './components/FileManagment/TaskAttachmentList';
import Taksperday from './components/Reports/Taskperday';
import ProjectDetails from './components/ProjectDetails';
import PasswordChangePage from './views/accounts/passwordchange';

// PrimeReact Styles
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import GanttChart from './components/Reports/mygantchart';
import Mygantchart from './components/Reports/mygantchart';
import ProjectResource from './components/FileManagment/projectresource';
import SchedulerComponent from './components/Calendar';

function App() {
 

  return (
    <Router>
      <AuthProvider>
        <PrimeReactProvider>
          <Switch>
            <Route path="/login" component={Loginpage} exact />
            <Route path="/register" component={Registerpage} exact />
            <Route path="/passwordchange" component={PasswordChangePage} exact />
            <Route path="/changepassword" component={PasswordChangePage} exact />

            <PrivateRoute path="/dashboard" component={DashboardLTE} exact />
            <PrivateRoute path="/projectsDashboard" component={ProjectsDashboard} exact />
            <PrivateRoute path="/projectdetails" component={ProjectDetails} exact />
            <PrivateRoute path="/tasklist" component={TaskList} exact />
            <PrivateRoute path="/activityboardlist" component={ActivityBoardList} exact />
            <PrivateRoute path="/issues/:taskId" component={IssuePage} exact />
            <PrivateRoute path="/issues/detail/:id" component={IssueDetailPage} exact />
            <PrivateRoute path="/calendar" component={SchedulerComponent} exact />
            <PrivateRoute path="/taskdt" component={Taskdetail} exact />
            <PrivateRoute path="/attachments" component={TaskAttachmentList} exact />

            <PrivateRoute path="/resources" component={ProjectResource} exact />

            <PrivateRoute path="/charts" component={Taksperday} exact />
            <PrivateRoute path="/project" component={ProjectListDT} exact />
            <PrivateRoute component={GanttChart} path="/ganttchart" exact />
            
            {/* Default redirect to login */}
            <Redirect from="/" to="/login" exact />
            {/* Catch all route to handle non-existent routes */}
            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        </PrimeReactProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
