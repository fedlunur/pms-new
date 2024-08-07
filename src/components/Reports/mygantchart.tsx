
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "../view-switcher";
import { getStartEndDateForProject } from "../helper";
import "gantt-task-react/dist/index.css";
import useAxios from "../../utils/useAxios";
import React, { useState, useEffect } from "react";
import Layout from "../../views/Layout";



const Mygantchart = () => {
  const currentDate = new Date();
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const api = useAxios();
  const viewModeStyles = {
    [ViewMode.Day]: 'gantt-view-hourQuarter',
    [ViewMode.Month]: 'gantt-view-dayHalf',
    // Add other view modes
  };
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
  const fetchData = async () => {
    console.log("Inside fetchData");
    try {
      setLoading(true);
  
      const [
        projectsResponse,
        activitiesResponse,
        tasksResponse,
      ] = await Promise.all([
        api.get("/project/"),
        api.get("/activitylist/"),
        api.get("/tasklist/"),
      ]);
  
      if (
        projectsResponse.status < 200 || projectsResponse.status >= 300 ||
        activitiesResponse.status < 200 || activitiesResponse.status >= 300 ||
        tasksResponse.status < 200 || tasksResponse.status >= 300
      ) {
        throw new Error("One or more network responses were not ok");
      }
  
      const projectsData = projectsResponse.data.length ? projectsResponse.data : [{ id: 'p1', project_name: 'Dummy Project' }];
      const activitiesData = activitiesResponse.data.length ? activitiesResponse.data : [{ id: 'a1', list_title: 'Dummy Activity', project_name: 'p1' }];
      const tasksData = tasksResponse.data.length ? tasksResponse.data : [{ id: 't1', task_name: 'Dummy Task', activity: 'a1', project: 'p1', created_at: '2024-04-20T18:38:35.637304Z', due_date: '2024-08-26' }];
  
      console.log("Fetched data:", { projectsData, activitiesData, tasksData });
  
      const extractDateComponents = (dateString) => {
        const date = new Date(dateString);
        return {
          year: date.getFullYear(),
          month: date.getMonth(), // Zero-based month
          day: date.getDate(), // Day of the month
        };
      };
  
      const formattedTasks = projectsData.map(project => {
        const projectTask = {
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
          .map(activity => {
            const activityTask = {
              start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
              end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
              name: activity.list_title || "Unnamed Activity",
              id: activity.id || "Unnamed Activity ID",
              progress: 0,
              type: 'milestone',
              hideChildren: true,
              dependencies: [project.id],
              displayOrder: 1,
              project: project.id,
            };
  
            const taskCards = tasksData
              .filter(task => task.activity === activity.id)
              .map(task => {
                const createdAtComponents = extractDateComponents(task.created_at);
                const dueDateComponents = extractDateComponents(task.due_date);
  
                return {
                  start: new Date(createdAtComponents.year, createdAtComponents.month, createdAtComponents.day),
                  end: new Date(dueDateComponents.year, dueDateComponents.month, dueDateComponents.day),
                  name: task.task_name || "Unnamed Task",
                  id: task.id || "Unnamed Task ID",
                  progress: task.progress || 0,
                  type: 'task',
                  dependencies: [activity.id],
                  hideChildren: true,
                  displayOrder: 2,
                  project: project.id,
                };
              });
  
            return [activityTask, ...taskCards];
          });
  
        return [projectTask, ...activityTasks.flat()];
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
  const handleTaskClick = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, hideChildren: !task.hideChildren };
        }
        return task;
      })
    );
  };
  
  
  const renderGantt = () => {
    return tasks
      .filter(task => task.type === 'project')
      .map(projectTask => (
        <div key={projectTask.id} onClick={() => handleTaskClick(projectTask.id)}>
          <Gantt tasks={[projectTask]} />
          {!projectTask.hideChildren && renderChildren(projectTask.id)}
        </div>
      ));
  };
  
  const renderChildren = (parentId: string) => {
    return tasks
      .filter(task => task.dependencies?.includes(parentId))
      .map(childTask => (
        <div key={childTask.id} onClick={() => handleTaskClick(childTask.id)}>
          <Gantt tasks={[childTask]} />
          {!childTask.hideChildren && renderChildren(childTask.id)}
        </div>
      ));
  };
  
  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
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
