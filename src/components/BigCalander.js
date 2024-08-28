const schedulerData = new SchedulerData(new dayjs().format(DATE_FORMAT), ViewType.Week);

//set locale dayjs to the schedulerData, if your locale isn't English. By default, Scheduler comes with English(en, United States).
schedulerData.setSchedulerLocale('pt-br'); // this uses dayjs, but it doesn't require dayjs to be installed as its called dynamically
schedulerData.setCalendarPopoverLocale('pt_BR'); // this uses antd [List of supported locales](https://ant.design/docs/react/i18n#supported-languages)

schedulerData.setResources([
  { id: 'r0', name: 'Resource0', groupOnly: true },
  { id: 'r1', name: 'Resource1' },
  { id: 'r2', name: 'Resource2', parentId: 'r0' },
  { id: 'r3', name: 'Resource3', parentId: 'r4' },
  { id: 'r4', name: 'Resource4', parentId: 'r2' },
]);

// the event array should be sorted in ascending order by event.start property
// otherwise there will be some rendering errors
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

// ...

//3. render the scheduler component, mind that the Scheduler component should be placed in a DragDropContext(father or ancestor).

<Scheduler
  schedulerData={schedulerData}
  prevClick={this.prevClick}
  nextClick={this.nextClick}
  onSelectDate={this.onSelectDate}
  onViewChange={this.onViewChange}
  eventItemClick={this.eventClicked}
/>;