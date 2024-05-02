import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";

import ProjectCard from "./ProjectCard";

const ProjectListDT = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useAxios();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/project/");
      setData(response.data);
      console.log("Here is data ===> " + response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message || "An error occurred");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid" style={{ paddingTop: 100 }}>
      <h1>Projects</h1>

      <div className="card-container">
        {data.map((Project) => (
          <ProjectCard
            key={Project.id}
            title={Project.project_name}
            content={Project.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectListDT;
