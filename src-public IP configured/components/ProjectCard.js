import React from "react";
import MyComponent from "./Activity/Checklist";
import { useHistory } from "react-router-dom";

function ProjectCard({ key, project,index,users,teammebers,activities }) {

  const history = useHistory();


  const card_background = [
    "bg-info",
    "bg-success",
    "bg-primary",
     "bg-warning",
  ];

 const retrive_activities_and_members=(project) =>{
   


 }

  const ActivityListForProject = (projects) => {
 
    history.push("/activityboardlist", {
      projects: project,
      users: users,
      teammebers: teammebers,
      activities: activities,
    });
   
  };
  // Calculate background index with modulo for safety
  const backgroundIndex = index % card_background.length;
  const cardBackgroundClass = card_background[backgroundIndex];
  console.log("Back ground class ££££ " ,cardBackgroundClass)
  return (
    <div className="col-lg-3 col-6">
      {/* small box */}
      <div className={`small-box color ${cardBackgroundClass}`}>
        <div className="inner">
          <h5>{project.project_name}</h5>
          
        </div>
            <div className="icon">
              <i className="ion ion-bag" />
            </div>
            <p>
          {project.start_date}
          </p>
            <a onClick={ActivityListForProject}  className="small-box-footer">
             More info <i className="fas fa-arrow-circle-right" />
            </a>
      </div>
    </div>
  );
}
export default ProjectCard;
