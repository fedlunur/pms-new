import React, { useState, useEffect } from "react";
import Layout from "../../../views/Layout";
import useAxios from "../../../utils/useAxios";
import { useHistory } from "react-router-dom";
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';

import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
function Taskdetail() {

  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskmembers, setTaskmembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false); 
  const api = useAxios();
  const history = useHistory();

  useEffect(() => {
    fetchData();
    initFilters();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        projectsResponse,
        activitiesResponse,
        tasksResponse,
        taskMemberResonse,
        userResponse,
       
      ] = await Promise.all([
        api.get("/project/"),
        api.get("/activitylist/"),
        api.get("/tasklist/"),
        api.get("/taskmembers/"),
        api.get("/users/"),
      ]);

      if (projectsResponse.status < 200 || projectsResponse.status >= 300) {
        throw new Error("One or more network responses were not ok");
      }

      const projectsData = projectsResponse.data;
      const activitiesData = activitiesResponse.data;
      const tasksData = tasksResponse.data;
      const usersData = userResponse.data;
      const taskmemberdata=taskMemberResonse.data;
    
      setProjects(projectsData);
      setActivities(activitiesData);
      setTasks(tasksData);
      setUsers(usersData);
      setTaskmembers(taskmemberdata);


    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      setLoading(false);
    }
  };
  const statuses = [
    { label: 'Normal', value: '0' },
    { label: 'Low', value: '1' },
    { label: 'High', value: '2' },
  ];

  
  const clearFilter = () => {
    initFilters();
};
const onGlobalFilterChange = (e) => {
  const value = e.target.value;
  let _filters = { ...filters };

  _filters['global'].value = value;

  setFilters(_filters);
  setGlobalFilterValue(value);
};

const initFilters = () => {
  setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      task_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    
      description: { value: null, matchMode: FilterMatchMode.IN },
      date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
      projectname :{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      activity: { value: null, matchMode: FilterMatchMode.CONTAINS },
     
  });
  setGlobalFilterValue('');
};
 
  const getSeverity = (status) => {
    switch (status) {
      case '0':
        return 'info'; // Adjust severity based on your preferences
      case '1':
        return 'success';
      case '2':
        return 'danger';
      default:
        return 'default'; // Provide a default severity for unknown statuses
    }
  };
  
  const statusBodyTemplate = (rowData) => {
    const status = statuses.find(option => option.value === rowData.status);
    return status ? <Tag value={status.label} severity={getSeverity(rowData.status)} /> : <p>Unknown</p>; // Handle missing statuses gracefully
  };
  const getActivityName = (rowData) => {
    // Find the matching activity object based on activity ID (assuming a foreign key)
    const matchingActivity = activities.find((activity) => activity.id === rowData.activity);
  
    if (!matchingActivity) {
      return <p>Unknown Activity</p>;
    }
  
    return <Tag value={matchingActivity.list_title} />;
  };

  const getProjectNameUsingActivity = (rowData) => {
    // Find the matching activity object based on activity ID (assuming a foreign key)
    const matchingActivity = activities.find((activity) => activity.id === rowData.activity);
    console.log("The maching  activity is ===> "+matchingActivity.id)
    const matchingProject = projects.find((project) => project.id === matchingActivity.project_name);
  
    if (!matchingProject) {
      return <p>Unknown Project Name</p>;
    }
  
    return matchingProject.project_name ;// <Tag value={matchingActivity.project} />;
  };
  const getOptions = () => {
    // Extract activity names (assuming a 'list_title' property)
    const activityOptions = activities.map((activity) => ({
      label: activity.list_title, // Replace with the appropriate property name
      value: activity.id, // Replace with the appropriate property name (for filtering)
    }));

    return activityOptions;
  };
  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };
  const getActivityOptions = () => {
    // Extract activity names (assuming a 'list_title' property)
  
    const activityOptions = activities.map((activity) => ({
      label: activity.list_title, // Replace with the appropriate property name
      value: activity.id, // Replace with the appropriate property name (for filtering)
    }));
  
    console.log("I have activities of this length: " + activityOptions.length);
    console.log("Activity options: ", activityOptions);
    return activityOptions;
  };
  const filterCallback = (filterValue, index) => {
    const lowerCaseValue = filterValue.toLowerCase(); // Convert filter value to lowercase for case-insensitive filtering
    return activities.filter((activity) =>
      activity.list_title.toLowerCase().startsWith(lowerCaseValue)
    );
  };
  
  const activityFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={getActivityOptions()} // Call the function to get the options array
    
        onChange={(e) => {
          const trimmedValue = typeof e.value === 'string' ? e.value.trim() : e.value;
          options.filterCallback(trimmedValue, options.index);
        }}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };
  const activityBodyTemplate = (rowData) => {
    return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '6px' }}></ProgressBar>;
};
  const renderHeader = () => {
    return (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </IconField>
        </div>
    );
};
const header = renderHeader();
  const statusItemTemplate = (option) => {
    return <span>{option.label}</span>; // Display label directly in filter options
  };
  const teammemberTemplate = (rowData) => {
    return (<div style={{ display: "flex", gap: "8px" }}>
    {taskmembers
      .filter((taskm) => taskm.task_id === rowData.id)
      .map((taskMember) => (
        <div key={taskMember.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            onClick={() => console.log(taskMember.assigned_to_id)}
            src={"https://joesch.moe/api/v1/random?key=" + taskMember.assigned_to_id}
            style={{ cursor: "pointer" }}
          />
          <span>{taskMember.assigned_to_first_name}</span>
        </div>
      ))}
  </div>)// Handle missing statuses gracefully
  };
  
  return (
    <Layout>
      <div class="content-wrapper">
        <div class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="m-0">Task Detail </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <section className="content">
              <div className="container-fluid">
                {/* Info boxes */}
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box">
                      <span className="info-box-icon bg-info elevation-1">
                        <i className="fas fa-cog" />
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Total Task</span>
                        <span className="info-box-number">
                          {tasks.length}
             
                        </span>
                      </div>
                      {/* /.info-box-content */}
                    </div>
                    {/* /.info-box */}
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-warning elevation-1">
                        <i className="fas fa-users" />
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">To-Do</span>
                        <span className="info-box-number">{tasks.filter(task=>task.activity ===4).length}</span>

                      </div>
                      {/* /.info-box-content */}
                    </div>
                    {/* /.info-box */}
                  </div>
                  {/* /.col */}
                  <div className="col-12 col-sm-6 col-md-3"> 
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-success elevation-1">
                        <i className="fas fa-shopping-cart" />
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">On-Progress</span>
                         {/* "On-Progress" */}
                    
                        <span className="info-box-number">{tasks.filter(task=>task.activity ===5  ).length}</span>
                      </div>
                      {/* /.info-box-content */}
                    </div>
                    {/* /.info-box */}
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-danger elevation-1">
                        <i className="fas fa-thumbs-up" />
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Completed</span>
                        {/* "Done" 6 */}
                        <span className="info-box-number">{tasks.filter(task=>task.activity ===6).length}</span>
                      </div>
                      {/* /.info-box-content */}
                    </div>
                    {/* /.info-box */}
                  </div>
                  {/* /.col */}
                  {/* fix for small devices only */}
                  <div className="clearfix hidden-md-up" />
               
                  {/* /.col */}
                
                  {/* /.col */}
                </div>
                {/* /.row */}

                {/* /.row */}
                {/* Main row */}



                <div className="card">
                  <div className="card-header border-transparent">
                 
                    <a
                      href="javascript:void(0)"
                      className="btn btn-sm btn-info float-left"
                    >
                      Detail Table
                    </a>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                      >
                        <i className="fas fa-minus" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="remove"
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <div className="table-responsive">




                    {loading ? (
        <p>Loading tasks...</p>
      ) : (
       
        <DataTable value={tasks} 
        
        paginator showGridlines rows={10} loading={loading} dataKey="id" 
                    filters={filters} globalFilterFields={['task_name', 'description', 'projectname', 'activity','due_date', 'status']} header={header}
                    emptyMessage="No customers found."
        >
          <Column field="task_name" header="Task Name" sortable style={{ width: '25%' }} />
          <Column field="description" header="Description" sortable style={{ width: '50%' }} />
          <Column field="projectname" body={getProjectNameUsingActivity}  filter  header="Project Name" sortable style={{ width: '25%' }} />
          <Column field="activity" body={getActivityName} header="Activity"  filterElement={activityFilterTemplate}  filter sortable style={{ width: '25%' }} />

          <Column field="team" body={teammemberTemplate} header="TeamMembers"  style={{ width: '25%' }} />

          <Column field="cover" header="Cover" sortable style={{ width: '25%' }} />
          <Column field="due_date" header="Due Date" sortable style={{ width: '25%' }} />
          <Column field="activity" header="Completed/Not Completed"  style={{ minWidth: '12rem' }} body={activityBodyTemplate}  />

          {/* Add more columns as needed based on your Task model fields */}
          <Column field="status" header="Status" sortable style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
          {/* Consider adding a custom renderer for the status column to display human-readable labels */}
        </DataTable>
      )}
        
        
                    </div>
                    {/* /.table-responsive */}
                  </div>
                  {/* /.card-body */}
                
                  {/* /.card-footer */}
                </div>
              
                {/* /.row */}
              </div>
              {/*/. container-fluid */}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default Taskdetail;
