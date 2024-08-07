import moment from 'moment';

const formattedDate = moment(new Date()).format('YYYY-MM-DD');
import React, { useEffect, useRef, useState } from "react";

import Layout from "../../views/Layout";
import Gantt from '../Gantt';
import Mygantchart from './mygantchart';
const data = {
  data: [
      { id: 1, text: 'Task #1', start_date: '2019-04-15', duration: 3, progress: 0.6 },
      { id: 2, text: 'Task #2', start_date: '2019-04-18', duration: 3, progress: 0.4 }
  ],
  links: [
      { id: 1, source: 1, target: 2, type: '0' }
  ]
};
const GanttChart = () => {
 


  return (
    <Layout>
        <div>
                <div   style={{ width: "100%", height: "95vh" }} className="gantt-container">
                     <Mygantchart
                      />
                </div>
            </div>
    
    </Layout>
  );
};

export default GanttChart;
