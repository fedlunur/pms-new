import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import useAxios from '../../utils/useAxios';

export default function TasksBar() {
  const [labels, setLabels] = useState([]);
  const [counts, setCounts] = useState([]);
  const api = useAxios();

  useEffect(() => {
    const fetchAndProcessIssues = async () => {
      try {
        const response = await api.get('/issues/');
        console.log(response.data, "response.data");
        const issuesData = response.data;

        const issuesByMonth = {};
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        months.forEach((month) => {
          issuesByMonth[month] = 0;
        });

        issuesData.forEach((issue) => {
          const issueMonth = new Date(issue.created_at).toLocaleString('default', {
            month: 'long',
          });
          if (issuesByMonth[issueMonth] !== undefined) {
            issuesByMonth[issueMonth]++;
          }
        });

        setLabels(Object.keys(issuesByMonth));
        setCounts(Object.values(issuesByMonth));
      } catch (error) {
        console.error('Error fetching and processing issues:', error);
      }
    };

    fetchAndProcessIssues();
  }, []);

  return (
    <BarChart
      className='w-full'
      height={550}
      series={[
        { data: counts, label: 'Issues', id: 'issuesId',color: '#1d4ed8' },
      ]}
      xAxis={[{ data: labels, scaleType: 'band' }]}
    />
  );
}