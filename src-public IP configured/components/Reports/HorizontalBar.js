
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
    const backgroundColors = chartColors.map(variable => documentStyle.getPropertyValue(variable).trim());
    const documentStyle = getComputedStyle(document.documentElement);
    const handleChange = (event) => {
        setSelectedProject(event.value);
    };

    const searchbyproject = () => {
        if (selectedProject) {
            console.log("Selected Project====> ",selectedProject)
            const filteredActivities = allactivities.filter(activity => activity.project_name === selectedProject);
            console.log("££££££----- >  Filtered Activities ",filteredActivities)
            const tasksPerActivity = filteredActivities.map(activity => {
                const count = alltasks.filter(task => task.activity === activity.id).length;
                return count;
            });

            const data = {
                labels: filteredActivities.map(activity => activity.list_title),
                datasets: [
                    {
                        data: tasksPerActivity,
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: backgroundColors,
                    }
                ]
            };

            setUniqueActivities(filteredActivities);
            setChartData(data);
            console.log("££££££----- >  Updated chart with  ",data)
        }
    };

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  
        if (allprojects.length > 0) {
            const formattedProjects = allprojects.map(project => ({
                label: project.project_name,
                value: project.id
            }));
            setProjectsList(formattedProjects);
        }


        if (allactivities.length > 0 && alltasks.length > 0 && !selectedProject) {
            const activitiesUnique = allactivities.filter((activity, index, self) =>
                self.findIndex(a => a.list_title.toLowerCase() === activity.list_title.toLowerCase()) === index
            );
            const tasksPerActivity = activitiesUnique.map(activity => {
                const count = alltasks.filter(task => task.activity === activity.id).length;
                return count;
            });

     const data = {
                labels: activitiesUnique.map(activity => activity.list_title),
                datasets: [
                    {
                        data: tasksPerActivity,
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: backgroundColors,
                    }
                ]
            };

            setUniqueActivities(activitiesUnique);
            setChartData(data);
        }


        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'On Progress',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Tasks Done',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
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

        setChartData(data)
        setChartOptions(options);
    }, []);

    return (
        <div className="card">
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    )
}
        