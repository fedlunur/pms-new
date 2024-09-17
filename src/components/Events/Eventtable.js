import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

const EventTable = ({ events }) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link to={`/event/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'end',
      key: 'end',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={events}
      rowKey="id"
      pagination={{ pageSize: 5 }} // Adjust page size as needed
    />
  );
};

export default EventTable;
