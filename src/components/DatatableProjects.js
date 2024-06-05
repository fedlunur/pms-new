import React, { useState, useEffect } from "react";
import Layout from "../views/Layout";
import useAxios from "../utils/useAxios";
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

import { useLocation } from "react-router-dom";
import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

function DatatableProjects({ projects,
  teammembers,
  users,
  activities,tasks }) {
  

  



  const teammemberTemplate = (rowData) => {
    return (<div style={{ display: "flex", gap: "8px" }}>
    {teammembers
      .filter((member) => member.team.id === rowData.id)
      .map((member) => (
        <div key={member.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            onClick={() => console.log(member.id)}
            src={"https://joesch.moe/api/v1/random?key=" + member.id}
            style={{ cursor: "pointer" }}
          />
          <span>{member.user.first_name}</span>
        </div>
      ))}
  </div>)// Handle missing statuses gracefully
  };


  const totalTaskTemplate = ( rowData ) => {
  
  console.log("For the project  ======> ",rowData)
    // Filter activities based on project association (assuming 'project_id' is the property on activity)
    const activityList = activities.filter((activity) => activity.project_name === rowData.id);
  console.log("The actvities List => ",activityList)
    // Filter tasks based on activity association (assuming 'activity_id' is the property on task)
    const tasklist= tasks.filter((task) => activityList.some((activity) => activity.id === task.activity));
    console.log("The taks  List => ",tasklist)
    // Calculate the total number of tasks (assuming tasks is an array)
    const taskCount = tasklist.length;
  
    return (
      <div style={{ display: "flex", gap: "8px" }}>
        {taskCount}  {/* Display the total task count */}
      </div>
    );
  };
  


 
  const history = useHistory();
const projectDetail=(rowData)=>{
  return (
    <a
    onClick={() =>
      

          history.push("/activityboardlist", {
            projects: rowData,
            users: users,
            teammebers: teammembers,
            activities: activities,
          })
      
      
      
    }
    className="small-box-footer"
  >
    More info <i className="fas fa-arrow-circle-right" />
  </a>
  );

}




  return (
    <div>
      <section className="content">
        {/* Default box */}
 
        
          <div className="card">
                  <div className="card-header border-transparent">
                 
                    <a
                      href="javascript:void(0)"
                      className="btn btn-sm btn-info float-left"
                    >
                    Projects List
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




   
        <DataTable value={projects} responsiveLayout="stack">
          <Column field="project_name" header="Project Name" sortable style={{ width: '25%' }} />
          <Column field="description" header="Description" sortable style={{ width: '50%' }} />
          {/* <Column field="created_at" body={getProjectNameUsingActivity}  filter  header="Project Name" sortable style={{ width: '25%' }} />
          <Column field="activity" body={getActivityName} header="Activity"  filterElement={activityFilterTemplate}  filter sortable style={{ width: '25%' }} /> */}

         <Column field="team" body={teammemberTemplate} header="TeamMembers"  style={{ width: '25%' }} /> 

        
          <Column field="Total tasks" body={totalTaskTemplate}  header="Total taks" sortable style={{ width: '25%' }} />  
          {/* Add more columns as needed based on your Task model fields */}
          <Column field="start_date" header="start_date" sortable style={{ minWidth: '12rem' }}  filter  />
          <Column field="end_date" header="end_date" sortable style={{ minWidth: '12rem' }}  filter  />
          <Column field="Detail" header="Detail" body={projectDetail}  sortable style={{ minWidth: '12rem' }}  filter  />
          {/* Consider adding a custom renderer for the status column to display human-readable labels */}
        </DataTable>
      
        
        
                    </div>
                    {/* /.table-responsive */}
                  </div>
                  {/* /.card-body */}
                
                  {/* /.card-footer */}
                </div>
              
          {/* /.card-body */}
    
        {/* /.card */}
      </section>
    </div>
  );
}

export default DatatableProjects;
