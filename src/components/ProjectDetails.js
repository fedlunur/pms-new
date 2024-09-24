import React, { useState, useEffect } from "react";
import Layout from "../views/Layout";
import { Table, Row, Col } from "antd";
import DataService from "./DataServices";

const ProjectDetails = () => {
  const { allprojects, alltasks, activities_by_project } = DataService();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(alltasks);
  }, [alltasks]);

  // Helper function to get remaining time details
  const getRemainingTimeDetails = (dueDate) => {
    if (!dueDate) return { text: "None", color: "text-red-500" };

    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0)
      return { text: "Passed", color: "text-red-400 font-semibold" };
    if (days === 0)
      return { text: "Due today", color: "text-orange-400 font-semibold" };
    if (days === 1)
      return { text: "1 day left", color: "text-orange-400 font-semibold" };
    if (days === 2)
      return { text: "2 days left", color: "text-orange-400 font-semibold" };

    return { text: `${days} days left`, color: "text-gray-400 font-semibold" };
  };

  // Helper function to get task priority
  const getPriority = (priority) => {
    if (priority === "0") {
      return {
        text: "Normal",
        color:
          "bg-orange-100 text-orange-500 px-2 py-1 rounded-sm font-semibold",
      };
    } else if (priority === "1") {
      return {
        text: "Low",
        color: "bg-green-100 text-green-500 px-2 py-1 rounded-sm font-semibold",
      };
    } else if (priority === "2") {
      return {
        text: "High",
        color: "bg-red-100 text-red-500 px-2 py-1 rounded-sm font-semibold",
      };
    } else {
      return {
        text: "None",
        color: "bg-gray-100 text-gray-500 px-2 py-1 rounded-sm font-semibold",
      };
    }
  };

  // Define columns for the expandable table
  const columns = [
    {
      title: "Activity",
      dataIndex: "activity_name",
      key: "activity_name",
    },
    {
      title: "Task Name",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Remaining Days",
      key: "remaining_time",
      render: (task) => {
        const remainingTime = getRemainingTimeDetails(task.due_date);
        return (
          <span className={`${remainingTime.color}`}>{remainingTime.text}</span>
        );
      },
    },
    {
      title: "Priority",
      key: "priority",
      render: (task) => {
        const priority = getPriority(task.status);
        return <span className={`${priority.color}`}>{priority.text}</span>;
      },
    },
  ];

  // Function to render the expanded content with tasks for each project
  const expandedRowRender = (project) => {
    const activities = activities_by_project(project);
    const projectTasks = tasks
      .filter((task) =>
        activities.some((activity) => activity.id === task.activity)
      )
      .map((task) => {
        const activity = activities.find(
          (activity) => activity.id === task.activity
        );
        return {
          ...task,
          activity_name: activity ? activity.list_title : "Unknown",
        };
      });

    return (
      <Table
        columns={columns}
        dataSource={projectTasks}
        pagination={false}
        rowKey={(record) => record.id}
        rowHoverable={false}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-green-50" : "bg-white"
        }
      />
    );
  };

  // Function to render project details with expandable rows for activities and tasks
  const renderProjectDetails = () => {
    const projectColumns = [
      {
        title: "Project Name",
        dataIndex: "project_name",
        key: "project_name",
      },
      {
        title: "Project Description",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Start Date",
        dataIndex: "start_date",
        key: "start_date",
      },
      {
        title: "End Date",
        dataIndex: "end_date",
        key: "end_date",
      },
    ];

    return (
      <Table
        columns={projectColumns}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => !!activities_by_project(record).length,
        }}
        dataSource={allprojects}
        rowKey={(record) => record.id}
        pagination={true}
        rowHoverable={false}
        className="py-2"
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-blue-100" : "bg-white"
        }
      />
    );
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Project Details</h1>
        {renderProjectDetails()}
      </div>
    </Layout>
  );
};

export default ProjectDetails;
