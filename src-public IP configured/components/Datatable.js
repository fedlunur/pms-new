import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import OvalAvatar from "./OvalAvator";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

function DatatableProjects({ projects, teammembers, users, activities }) {
  const [allmembers, setAllmembers] = useState([]);
  const api = useAxios();
  const history = useHistory();
  const location = useLocation();

  
  const activitiesnew = activities;
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const response = await api.get("/proproject/api/teammembers/");
    setAllmembers(response.data);
  };
  const ActivityListForProject = (projects, members, users, activitiesdata) => {
    console.log(
      "The data are before pusing to activity board " +
        projects +
        activitiesdata
    );
    history.push("/activityboardlist", {
      projects: projects,
      users: users,
      teammebers: members,
      activities: activitiesdata,
    });
  };

  return (
    <div>
      <section className="content">
        {/* Default box */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title bg-info">Projects List </h3>
            <div className="card-tools">
              <button
                type="button"
                className="btn btn-tool"
                data-card-widget="collapse"
                title="Collapse"
              >
                <i className="fas fa-minus" />
              </button>
              <button
                type="button"
                className="btn btn-tool"
                data-card-widget="remove"
                title="Remove"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <table className="table table-striped projects">
              <thead>
                <tr>
                  <th style={{ width: "1%" }}>#</th>
                  <th style={{ width: "20%" }}>Project Name</th>
                  <th style={{ width: "20%" }}>Description</th>
                  {/* <th style={{ width: "30%" }}>Team Members</th> */}
                  <th>Project teams</th>
                  <th style={{ width: "20%" }} className="text-center">
                    Status
                  </th>
                  <th style={{ width: "20%" }}>Project Team</th>
                  <th style={{ width: "20%" }}>Start Date</th>
                  <th style={{ width: "20%" }}>End Data</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <a>{project.project_name}</a>
                      <br />
                      <small>Created {project.created_at}</small>
                    </td>
                    <td>
                      <small> {project.description}</small>
                    </td>
                    <td>
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {teammembers
                          .filter((member) => member.team.id === project.team)
                          .map((member, index) => (
                            <li
                              key={member.id}
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {" "}
                                {/* Add flexbox style to align items horizontally */}
                                <OvalAvatar
                                  firstName={member.user.first_name}
                                  fatherName={member.user.middle_name}
                                  style={{ marginRight: "5px" }} // Add margin to create space between avatars
                                />
                                {/* <div>
            {member.user.full_name} {}
          </div> */}
                              </div>
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td className="project_progress">
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-green"
                          role="progressbar"
                          aria-valuenow={project.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <small>{project.progress}% Complete</small>
                    </td>
                    <td className="project-state">
                      <span>CDHi-Po{project.team.name}</span>
                    </td>
                    <td>
                      <small> {project.start_date}</small>
                    </td>
                    <td>
                      <small> {project.end_date}</small>
                    </td>

                    <td className="project-actions text-right">
                      {/* <a className="btn btn-primary btn-sm" href="#">
                        <i className="fas fa-folder"></i>
                        View
                      </a> */}

                      <a
                        onClick={() =>
                          ActivityListForProject(
                            project,
                            teammembers,
                            users,
                            activities
                          )
                        }
                        className="small-box-footer"
                      >
                        More info <i className="fas fa-arrow-circle-right" />
                      </a>
                      {/* <a className="btn btn-danger btn-sm" href="#">
                        <i className="fas fa-trash"></i>
                        Delete
                      </a> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* /.card-body */}
        </div>
        {/* /.card */}
      </section>
    </div>
  );
}

export default DatatableProjects;
