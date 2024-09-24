import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Space,
  Typography,
  Button,
  Avatar,
  Tooltip,
  Carousel,
  Radio,
  Modal,
} from "antd";
import { FaEye } from "react-icons/fa";
import "./DatatableProjects.css";
import { Margin } from "@mui/icons-material";
import Powerpoint from "./powerpoint";
const { Paragraph } = Typography;
const { Text } = Typography;

const contentStyle = {
  margin: 15,
  height: "460px",
  color: "#fff",
  lineHeight: "260px",
  textAlign: "center",
};
const rowStyle = {
  margin: 10, // Add margin
  padding: 15, // Add padding
};

// Utility function to chunk array into groups of a specified size
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

function DatatableProjects({
  projects,
  teammembers,
  users,
  activities,
  tasks,
}) {
  const history = useHistory();
  const [tasksForProject, setTasksForProject] = useState([]);

  const [dotPosition, setDotPosition] = useState("left");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePositionChange = ({ target: { value } }) => {
    setDotPosition(value);
  };

  const teammemberTemplate = (rowData) => {
    const members = teammembers.filter(
      (member) => member.team.id === rowData.team
    );
    return members.length > 0 ? (
      <Avatar.Group
        max={{
          count: 2,
          style: {
            color: "#3b82f6",
            backgroundColor: "#e0f2ff",
          },
        }}
      >
        {members.map((member) => (
          <Tooltip title={member.user.first_name} key={member.id}>
            <Avatar
              style={{
                backgroundColor: "#e0f2ff",
                color: "#3b82f6",
                cursor: "pointer",
              }}
              onClick={() => console.log(member.id)}
            >
              {member.user.first_name.charAt(0)}
            </Avatar>
          </Tooltip>
        ))}
      </Avatar.Group>
    ) : (
      <span>No Team Members</span>
    );
  };

  const totalTaskTemplate = (rowData) => {
    const activityList = activities.filter(
      (activity) => activity.project_name === rowData.id
    );
    const tasklist = tasks.filter((task) =>
      activityList.some((activity) => activity.id === task.activity)
    );
    const taskCount = tasklist.length;

    return <div style={{ display: "flex", gap: "8px" }}>{taskCount}</div>;
  };

  const fetchTasksForProject = (projectId) => {
    return tasks.filter((task) =>
      activities.some(
        (activity) =>
          activity.id === task.activity && activity.project_name === projectId
      )
    );
  };

  useEffect(() => {
    const tasksByProject = projects.map((project) => ({
      projectId: project.id,
      tasks: fetchTasksForProject(project.id),
    }));
    setTasksForProject(tasksByProject);
  }, [projects, tasks, activities]);

  const calculateProgress = (projectId) => {
    const projectTasks = tasksForProject.find(
      (p) => p.projectId === projectId
    )?.tasks;
    const doneTasks = projectTasks?.filter((task) =>
      activities.find(
        (activity) =>
          activity.id === task.activity && activity.list_title === "Done"
      )
    ).length;

    return projectTasks?.length > 0
      ? Math.ceil((doneTasks / projectTasks.length) * 100)
      : 0;
  };

  const ProjectDescription = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 100;

    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

    const truncatedDescription =
      description.length > MAX_LENGTH
        ? `${description.slice(0, MAX_LENGTH)}...`
        : description;

    return (
      <div>
        <Paragraph>{isExpanded ? description : truncatedDescription}</Paragraph>
        {description.length > MAX_LENGTH && (
          <Button type="link" onClick={handleToggle}>
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
        )}
      </div>
    );
  };

  // Group projects into sets of two
  const projectGroups = chunkArray(projects, 2);

  return (
    <div>
      <section>
        <div className="relative bg-transparent h-[90vh]">
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-[80%] h-[65vh] rounded-md  bg-blue-400 py-2">
            <h1 className="text-7xl font-bold text-center text-gray-200">
              Projects
            </h1>
            <p className="text-center text-gray-200 font-semibold">
              Track and manage your projects seamlessly with real-time updates
            </p>
          </div>
          {/* <Radio.Group
        onChange={handlePositionChange}
        value={dotPosition}
        style={{
          marginBottom: 8,
        }}
      >
        <Radio.Button value="top">Top</Radio.Button>
        <Radio.Button value="bottom">Bottom</Radio.Button>
        <Radio.Button value="left">Left</Radio.Button>
        <Radio.Button value="right">Right</Radio.Button>
      </Radio.Group> */}
          <Carousel
            fade="true"
            autoplay
            dotPosition={dotPosition}
            className="bg-transparent"
          >
            {projectGroups.map((group, index) => (
              <div key={index} className="w-[800px] mt-40">
                <Row style={{ ...contentStyle, ...rowStyle }} gutter={10}>
                  {group.map((project) => (
                    <Col span={12} key={project.id}>
                      <Card>
                        <div className="flex justify-between items-center ">
                          <div>
                            <h1 className="font-semibold text-lg text-gray-800">
                              {project.project_name}
                            </h1>
                            <div className="flex gap-1">
                              <span className="text-xs text-gray-500">
                                {totalTaskTemplate(project)}
                              </span>
                              <span className="text-xs text-gray-500">
                                Tasks Total
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-4 items-center">
                            <button
                              className="px-3 py-1  border-2 border-blue-500 text-blue-500 rounded-md font-bold hover:bg-blue-100"
                              onClick={showModal}
                            >
                              Present
                            </button>
                            <div className="bg-blue-100 w-6 h-6 flex items-center justify-center cursor-pointer rounded-full">
                              <FaEye
                                size={18}
                                className="text-blue-600"
                                onClick={() =>
                                  history.push("/activityboardlist", {
                                    projects: project,
                                    users: users,
                                    teammembers: teammembers,
                                    activities: activities,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <Divider />
                        <span className="text-xs text-gray-500">Progress</span>
                        <Progress
                          percent={calculateProgress(project.id)}
                          strokeColor={{ "0%": "#3b82f6", "100%": "#3f51b5" }}
                        />
                        <ProjectDescription description={project.description} />
                        <div className="flex justify-between mt-4">
                          <div>
                            <h1 className="text-gray-700">Created at:</h1>
                            <p className="font-semibold text-gray-900">
                              {project.start_date}
                            </p>
                          </div>
                          <div>
                            <h1 className="text-gray-700">Deadline:</h1>
                            <p className="font-semibold text-gray-900">
                              {project.end_date}
                            </p>
                          </div>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center">
                          {teammemberTemplate(project)}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Carousel>
        </div>
      </section>
      <Modal
        title="Powerpoint Presentation"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="z-50"
        width={1200}
        bodyStyle={{ height: "600px" }}
      >
        <div className="custom-modal-body">
          <Powerpoint />
        </div>
      </Modal>
    </div>
  );
}

export default DatatableProjects;
