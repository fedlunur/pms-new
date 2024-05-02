import Layout from "../../views/Layout";
import ActvityCard from "./ActvityCard";
import { useLocation } from "react-router-dom";

export default function ActivityBoardList() {
  const location = useLocation();
  const projects = location.state && location.state.projects;

  const teammebers = location.state && location.state.teammebers;
  const users = location.state && location.state.users;
  const activities = location.state && location.state.activities;

  const card_bacground_tiltle = [
    "card-secondary",
    "card-info",
    "card-primary",
    "card-success",
  ];
  // Extract the data from the state

  return (
    <Layout>
      <div>
        <div className="content-wrapper">
          {/* Main content */}
          <section className="content">
            <h2 style={{ textAlign: "center" }}>
              {projects.project_name} Kanban Board
            </h2>
            <div className="container-fluid">
              {/* Small boxes (Stat box) */}
              <div className="row">
                {/* <section className={`card  `} className="content pb-3"> */}
                <section className={`content pb-3 `}>
                  <ActvityCard
                  // key={member.id}
                  // activity={member}
                  // project={projects}
                  // index={index}
                  // headercolor={card_bacground_tiltle[index]}
                  />
                  {/* {activities.map((member, index) => (
              <ActvityCard
                key={member.id}
                activity={member}
                project={projects}
                index={index}
                headercolor={card_bacground_tiltle[index]}
              />
            ))} */}
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
