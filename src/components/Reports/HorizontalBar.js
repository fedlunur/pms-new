import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import DataService from '../DataServices';
import { chartColors } from './ColorsUtil';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

export default function HorizontalBarDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [projectsList, setProjectsList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const { allprojects, allactivities, alltasks } = DataService();
    const [uniqueActivities, setUniqueActivities] = useState([]);
    const documentStyle = getComputedStyle(document.documentElement);
    const backgroundColors = chartColors.map(variable => documentStyle.getPropertyValue(variable).trim());

    const handleChange = (event) => {
        setSelectedProject(event.value);
    };
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const searchbyproject = () => {
        if (selectedProject) {
            console.log("The selected project is ", selectedProject)
            const filteredActivities = allactivities.filter(activity => activity.project_name === selectedProject);
         
    
            // Ensure unique activities based on list_title for the filtered activities
            const seenTitles = new Set();
            const uniqueActivities = filteredActivities.filter(activity => {
                if (seenTitles.has(activity.list_title.toLowerCase())) {
                    return false;
                } else {
                    seenTitles.add(activity.list_title.toLowerCase());
                    return true;
                }
            }).map(activity => ({
                label: activity.list_title.toLowerCase(),
                value: activity.id
            }));
            setUniqueActivities(uniqueActivities);
    
            // Initialize tasksByMonth to hold all activity types
            const tasksByMonth = {};
            months.forEach(month => {
                tasksByMonth[month] = {};
                uniqueActivities.forEach(activity => {
                    tasksByMonth[month][activity.label] = 0;
                });
            });
    
            alltasks.forEach(task => {
                const taskMonth = new Date(task.due_date).toLocaleString('default', { month: 'long' });
                const activity = uniqueActivities.find(a => a.value === task.activity);
                if (tasksByMonth[taskMonth] && activity) {
                    tasksByMonth[taskMonth][activity.label]++;
                }
            });
    
            const labels = Object.keys(tasksByMonth);
            const datasets = uniqueActivities.map((activity, index) => {
                const activityTitle = activity.label;
                return {
                    label: activity.label,
                    backgroundColor: backgroundColors[index % backgroundColors.length], // Assign unique color
                    borderColor: backgroundColors[index % backgroundColors.length],
                    data: labels.map(month => tasksByMonth[month][activityTitle])
                };
            });
    
            setChartData({ labels, datasets });
        }
    };

    useEffect(() => {
        const fetchAndProcessTasks = async () => {
            try {
                // Assuming allprojects, allactivities, and alltasks are already fetched from the API.
                if (allprojects.length > 0) {
                    const formattedProjects = allprojects.map(project => ({
                        label: project.project_name,
                        value: project.id
                    }));
                    setProjectsList(formattedProjects);
                }

                // Ensure unique activities based on list_title
                const seenTitles = new Set();
                const uniqueActivities = allactivities.filter(activity => {
                    if (seenTitles.has(activity.list_title.toLowerCase())) {
                        return false;
                    } else {
                        seenTitles.add(activity.list_title.toLowerCase());
                        return true;
                    }
                }).map(activity => ({
                    label: activity.list_title.toLowerCase(),
                    value: activity.id
                }));
                setUniqueActivities(uniqueActivities);

              

                // Initialize tasksByMonth to hold all activity types
                const tasksByMonth = {};
                months.forEach(month => {
                    tasksByMonth[month] = {};
                    uniqueActivities.forEach(activity => {
                        tasksByMonth[month][activity.label] = 0;
                    });
                });

                alltasks.forEach(task => {
                    const taskMonth = new Date(task.due_date).toLocaleString('default', { month: 'long' });
                    const activity = uniqueActivities.find(a => a.value === task.activity);
                    if (tasksByMonth[taskMonth] && activity) {
                        tasksByMonth[taskMonth][activity.label]++;
                    }
                });

                const labels = Object.keys(tasksByMonth);
                const datasets = uniqueActivities.map((activity, index) => {
                    const activityTitle = activity.label;
                    return {
                        label: activity.label,
                        backgroundColor: backgroundColors[index % backgroundColors.length], // Assign unique color
                        borderColor: backgroundColors[index % backgroundColors.length],
                        data: labels.map(month => tasksByMonth[month][activityTitle])
                    };
                });

                const data = {
                    labels,
                    datasets
                };

                const textColor = documentStyle.getPropertyValue('--text-color');
                const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

                const options = {
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    aspectRatio: 0.8,
                    plugins: {
                        legend: {
                            labels: {
                                fontColor: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: textColorSecondary,
                                font: {
                                    weight: 500
                                }
                            },
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        },
                        y: {
                            ticks: {
                                color: textColorSecondary
                            },
                            grid: {
                                color: surfaceBorder,
                                drawBorder: false
                            }
                        }
                    }
                };

                setChartData(data);
                setChartOptions(options);
            } catch (error) {
                console.error('Error fetching and processing tasks:', error);
            }
        };

        fetchAndProcessTasks();
    }, [allprojects, allactivities, alltasks]);
    console.log(chartData)

    return (
        <div className="card">
        <div className="dropdown-search-container" style={{ display: "flex", alignItems: "center", gap: "8px",marginTop:10 }}>
          <Dropdown
            id="task_card" className='font-bold'
            value={selectedProject}
            options={projectsList}
            onChange={handleChange}
            filter
            showClear={true}
            placeholder="Select Project"
          />
          <Button icon="pi pi-search" onClick={searchbyproject} aria-label="Search" />
        </div>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    );
}
