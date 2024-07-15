import Layout from "../../views/Layout";
import ActvityCard from "./ActvityCard";
import { useLocation } from "react-router-dom";

export default function ActivityBoardList() {
  const location = useLocation();
  const projects = location.state && location.state.projects;

  // const teammebers = location.state && location.state.teammebers;
  // const users = location.state && location.state.users;



  // Extract the data from the state

  return (
    <Layout>
      <div>
        <div className="content-wrapper" style={{ minHeight: '806px' }}>
          {/* Main content */}
          <div className="centered-section">
          <section className="content">
            <h2 style={{ textAlign: "center" }}>
              {projects.project_name} Kanban Board
            </h2>
            <div  className="container-fluid">
              {/* Small boxes (Stat box) */}
              <div className="row">
                {/* <section className={`card  `} className="content pb-3"> */}
               
                  <ActvityCard
                    // key={member.id}
                
                    projects={projects}
                    // index={index}
                    // headercolor={card_bacground_tiltle[index]}
                  />
         
             
              </div>
            </div>
          </section>
          </div>
          </div>
        </div>
      
    </Layout>
  );
}
