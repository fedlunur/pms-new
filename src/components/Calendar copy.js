import React, { useState } from 'react';
import { Scheduler, SchedulerData, DATE_FORMAT } from 'react-big-schedule';
import dayjs from 'dayjs';
import BigScheduler from 'react-big-scheduler';

// import 'react-big-schedule/lib/css/style.css';

const SchedulerComponent = () => {
  const DATE_FORMAT = 'YYYY-MM-DD'; // Adjust based on your needs

  // Initialize SchedulerData with the current date and default view type
  const schedulerData = new SchedulerData(dayjs().format(DATE_FORMAT), ViewType.Week);

  schedulerData.setSchedulerLocale('pt-br'); // Set locale
  schedulerData.setCalendarPopoverLocale('pt_BR'); // Set calendar popover locale

  schedulerData.setResources([
    { id: 'r0', name: 'Resource0', groupOnly: true },
    { id: 'r1', name: 'Resource1' },
    { id: 'r2', name: 'Resource2', parentId: 'r0' },
    { id: 'r3', name: 'Resource3', parentId: 'r4' },
    { id: 'r4', name: 'Resource4', parentId: 'r2' },
  ]);

  schedulerData.setEvents([
    {
      id: 1,
      start: '2022-12-18 09:30:00',
      end: '2022-12-19 23:30:00',
      resourceId: 'r1',
      title: 'I am finished',
      bgColor: '#D9D9D9',
    },
    {
      id: 2,
      start: '2022-12-18 12:30:00',
      end: '2022-12-26 23:30:00',
      resourceId: 'r2',
      title: 'I am not resizable',
      resizable: false,
    },
    {
      id: 3,
      start: '2022-12-19 12:30:00',
      end: '2022-12-20 23:30:00',
      resourceId: 'r3',
      title: 'I am not movable',
      movable: false,
    },
    {
      id: 4,
      start: '2022-12-19 14:30:00',
      end: '2022-12-20 23:30:00',
      resourceId: 'r1',
      title: 'I am not start-resizable',
      startResizable: false,
    },
    {
      id: 5,
      start: '2022-12-19 15:30:00',
      end: '2022-12-20 23:30:00',
      resourceId: 'r2',
      title: 'R2 has recurring tasks every week on Tuesday, Friday',
      rrule: 'FREQ=WEEKLY;DTSTART=20221219T013000Z;BYDAY=TU,FR',
      bgColor: '#f759ab',
    },
  ]);

  // Define the callback functions
  const prevClick = () => {
    schedulerData.prev();
    schedulerData.setEvents(schedulerData.events);
  };

  const nextClick = () => {
    schedulerData.next();
    schedulerData.setEvents(schedulerData.events);
  };

  const onSelectDate = (date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(schedulerData.events);
  };

  const onViewChange = (view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.setEvents(schedulerData.events);
  };

  const eventClicked = (schedulerData, event) => {
    alert(`You clicked an event: {id: ${event.id}, title: ${event.title}}`);
  };

  return (
    <div className="scheduler-container">
      <Scheduler
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        onSelectDate={onSelectDate}
        onViewChange={onViewChange}
        eventItemClick={eventClicked}
      />
    </div>
  );
};

export default SchedulerComponent;




