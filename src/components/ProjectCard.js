import React from "react";
import MyComponent from "./Activity/Checklist";

function ProjectCard({ key, title, content }) {
  return (
    <div className="col-lg-3 col-6">
      {/* small box */}
      <div className="small-box bg-info">
        <div className="inner">
          <h5>{title}</h5>
          <p>24/05/06</p>
        </div>
        <div className="icon">
          <i className="ion ion-bag" />
        </div>
        <a href="#" className="small-box-footer">
          More info <i className="fas fa-arrow-circle-right" />
        </a>
      </div>
    </div>
  );
}
export default ProjectCard;
