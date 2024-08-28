import { Task, ViewMode, Gantt } from "gantt-task-react";
import { getStartEndDateForProject } from "../helper";
import "gantt-task-react/dist/index.css";
import useAxios from "../../utils/useAxios";
import React, { useState, useEffect } from "react";
import Layout from "../../views/Layout";
import { ViewSwitcher } from "../view-switcher";
const Mygantchart = () => {
  const currentDate = new Date();
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const api = useAxios();

  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  useEffect(() => {
    fetchData();
  }, []);
  const extractDateComponents = (dateString: string) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, tasksResponse, activitiesResponse] = await Promise.all([
        api.get("/project/"),
        api.get("/tasklist/"),
        api.get("/activitylist/"),
      ]);
  
      if (
        projectsResponse.status < 200 || projectsResponse.status >= 300 ||
        tasksResponse.status < 200 || tasksResponse.status >= 300 ||
        activitiesResponse.status < 200 || activitiesResponse.status >= 300
      ) {
        throw new Error("One or more network responses were not ok");
      }
  
      const projectsData = projectsResponse.data.length ? projectsResponse.data : [{ id: 'p1', project_name: 'Dummy Project' }];
      const tasksData = tasksResponse.data.length ? tasksResponse.data : [{ id: 't1', task_name: 'Dummy Task', project: 'p1', created_at: '2024-04-20T18:38:35.637304Z', due_date: '2024-08-26' }];
      const activitiesData = activitiesResponse.data.length ? activitiesResponse.data : [{ id: 'a1', list_title: 'Dummy Activity', project_name: 'p1' }];
  
      const formattedTasks = projectsData.map(project => {
        const projectTask: Task = {
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
          name: project.project_name || "Unnamed Project",
          id: project.id || "Unnamed Project ID",
          progress: 0,
          type: 'project',
          hideChildren: true,
          displayOrder: 0,
        };
  
        const activityTasks = activitiesData
          .filter(activity => activity.project_name === project.id)
          .map(activity => ({
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
            name: activity.list_title || "Unnamed Activity",
            id: activity.id || `activity-${activity.id}`, // Ensure unique ID
            progress: 0,
            type: 'milestone',
            hideChildren: true,
            displayOrder: 1,
            project: project.id,
          }));
  
        const relevantActivityIds = activitiesData
          .filter(activity => activity.project_name === project.id)
          .map(activity => activity.id);
  
          const taskCards = tasksData
          .filter(task => relevantActivityIds.includes(task.activity))
          .map(task => {
            const createdAtComponents = extractDateComponents(task.start_date ||task.created_at );
            const dueDateComponents = extractDateComponents(task.due_date ||task.created_at );
        
            return {
              start: new Date(createdAtComponents.year, createdAtComponents.month, createdAtComponents.day),
              end: new Date(dueDateComponents.year, dueDateComponents.month, dueDateComponents.day),
              name: task.task_name || "Unnamed Task",
              id: task.id || `task-${task.id}`, // Ensure unique ID
              progress: task.progress || 0,
              type: 'task',
              hideChildren: true,
              dependencies: [task.activity],
              displayOrder: 2,
              project: project.id,
            };
          });
  
        return [projectTask, ...activityTasks, ...taskCards];
      });
  
      setTasks(formattedTasks.flat());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (tasks.length === 0) {
    return <div>No tasks available</div>;
  }

  const handleTaskChange = (task: Task) => {
    setTasks(prevTasks => {
      // Check if the task already exists in the list
      const taskExists = prevTasks.some(t => t.id === task.id);
  
      // If the task doesn't exist, add it
      if (!taskExists) {
        return [...prevTasks, task];
      }
  
      // If the task exists, update it
      let updatedTasks = prevTasks.map(t => t.id === task.id ? task : t);
  
      // Update project start and end dates if needed
      if (task.project) {
        const [start, end] = getStartEndDateForProject(updatedTasks, task.project);
        const project = updatedTasks.find(t => t.id === task.project);
  
        if (
          project &&
          start &&
          end &&
          project.start &&
          project.end &&
          (project.start.getTime() !== start.getTime() || project.end.getTime() !== end.getTime())
        ) {
          // Update the project start and end dates
          const changedProject = { ...project, start, end };
          updatedTasks = updatedTasks.map(t =>
            t.id === task.project ? changedProject : t
          );
        }
      }
  
      return updatedTasks;
    });
  };
  
  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm(`Are you sure about deleting ${task.name}?`);
    if (conf) {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? task : t));
  };

  const handleDblClick = (task: Task) => {
    alert(`On Double Click event Id: ${task.id}`);
  };

  const handleClick = (task: Task) => {
    console.log(`On Click event Id: ${task.id}`);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(`${task.name} has ${isSelected ? 'selected' : 'unselected'}`);
  };

  const handleExpanderClick = (task: Task) => {
    console.log("Expander clicked: ", task);

    
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(t => {
        if (t.id === task.id) {
          return { ...t, hideChildren: !t.hideChildren };
        }
  
        if (t.project === task.id) {
          return { ...t, hideChildren: task.hideChildren };
        }
  
        return t;
      });
  
      return updatedTasks;
    });
  };
  

  return (
    <Layout>
      <div className="Wrapper">
        <ViewSwitcher
          onViewModeChange={viewMode => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
        <h3>Gantt With Unlimited Height</h3>
        <Gantt
          tasks={tasks}
          viewMode={view}
          onDateChange={handleTaskChange}
          onDelete={handleTaskDelete}
          onProgressChange={handleProgressChange}
          onDoubleClick={handleDblClick}
          onClick={handleClick}
          onSelect={handleSelect}
          onExpanderClick={handleExpanderClick}
          listCellWidth={isChecked ? "155px" : ""}
          columnWidth={columnWidth}
        />
      
       
      </div>
    </Layout>
  );
};

export default Mygantchart;
