import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Modal, Input, message, Form, DatePicker, Button } from 'antd';
import Layout from '../../views/Layout';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import useAxios from '../../utils/useAxios';
import ActivityCard from "./ActvityCard";
import AuthContext from '../../context/AuthContext';
import useRole from '../useRole';
import { AntDesignOutlined } from '@ant-design/icons';

const dateFormat = 'YYYY-MM-DD';

export default function ActivityBoardList() {
  const api = useAxios();
  const location = useLocation();
  const projects = location.state?.projects;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activityInputValue, setActivityInputValue] = useState('');
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logoutUser, roles } = useContext(AuthContext);
  const { hasAccess: canEdit } = useRole(['Admin', 'ProjectCoordinator']);
  const { hasAccess: canAdd } = useRole(['Admin', 'ProjectCoordinator']);
  const { hasAccess: canDelete } = useRole(['Admin', 'ProjectCoordinator']);
  const { hasAccess: canView } = useRole(['Member', 'Admin', 'ProjectCoordinator']);
  const { hasAccess: canMove } = useRole(['Member', 'Admin', 'ProjectCoordinator']);
  const [form] = Form.useForm();

  const permissions = {
    canEdit,
    canAdd,
    canDelete,
    canView,
    canMove,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [activitiesResponse, tasksResponse] = await Promise.all([
        api.get(`/activitylist/byproject/${projects.id}/`),
        api.get('/tasklist/'),
      ]);

      if (activitiesResponse.status < 200 || activitiesResponse.status >= 300) {
        throw new Error('One or more network responses were not ok');
      }

      setActivities(activitiesResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [api, projects.id]);

  const showModal = () => setIsModalOpen(true);

  const showActivityModal = () => setIsActivityModalOpen(true);

  const handleOk = () => {
    addTodo();
    setIsModalOpen(false);
  };

  const handleActivityOk = () => {
    addActivity();
    setIsActivityModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsActivityModalOpen(false);
  };

  const addTodo = async () => {
    if (inputValue.trim()) {
      try {
        const toDoActivity = activities.find((activity) => activity.list_title === 'To Do');
        if (toDoActivity) {
          const response = await api.post('/tasklist/', {
            task_name: inputValue,
            start_date: startDate,
            due_date: endDate,
            activity: toDoActivity.id,
            completed: false,
          });
          setTasks((prevTasks) => [...prevTasks, response.data]);
          setInputValue('');
          fetchData();
        }
      } catch (error) {
        console.error('Error adding task:', error);
        message.error('Failed to add task');
      }
    }
  };

  const addActivity = async () => {
    if (activityInputValue.trim()) {
      try {
        await api.post('/activitylist/', {
          project_name: projects.id,
          list_title: activityInputValue,
        });
        setActivityInputValue('');
        fetchData();
      } catch (error) {
        console.error('Error adding activity:', error);
        message.error('Failed to add activity');
      }
    }
  };

  const handleDateChange = (date, dateString, type) => {
    if (date) {
      if (type === 'start') {
        setStartDate(dateString);
      } else {
        setEndDate(dateString);
      }
    }
  };

  const deleteActivity = async (activityId) => {
    try {
      await api.delete(`/activitylist/${activityId}/`);
      fetchData();
      message.success('Activity deleted successfully');
    } catch (error) {
      console.error('Error deleting activity:', error);
      message.error('Failed to delete activity');
    }
  };

  return (
    <Layout>
      <div className="w-full flex flex-col space-y-4" style={{ height: '90vh' }}>
        <div className="flex justify-between font-bold">
          <h1 className="text-lg capitalize text-gray-800 font-semibold">
            {projects?.project_name} Kanban Board
          </h1>
          {canAdd && (
            <div className="flex gap-2 pr-20">
              <Button
                type="dashed"
                onClick={showModal}
                size="large"
                icon={<AntDesignOutlined />}
              >
                Add New Task
              </Button>
              <Button
                type="dashed"
                onClick={showActivityModal}
                size="large"
                icon={<AntDesignOutlined />}
              >
                Add Activity
              </Button>
            </div>
          )}
        </div>
        {loading ? (
          <p>Loading Board !!...</p>
        ) : (
          <ActivityCard
            key={`${activities.length}-${tasks.length}`}
            projects={projects}
            tasks={tasks}
            activities={activities}
            onDeleteActivity={deleteActivity}
            permissions={permissions}
          />
        )}
      </div>

      <Modal
        title="Add New Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={addTodo}
        >
          <Form.Item
            name="taskName"
            label="Task Name"
            rules={[{ required: true, message: 'Please enter a task name!' }]}
          >
            <Input
              placeholder="Task name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select a start date!' }]}
          >
            <DatePicker
              value={startDate ? dayjs(startDate, dateFormat) : null}
              onChange={(date, dateString) => handleDateChange(date, dateString, 'start')}
              format={dateFormat}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: 'Please select an end date!' }]}
          >
            <DatePicker
              value={endDate ? dayjs(endDate, dateFormat) : null}
              onChange={(date, dateString) => handleDateChange(date, dateString, 'end')}
              format={dateFormat}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="mt-4"
              htmlType="submit"
              disabled={!inputValue.trim() || !canAdd}
    
            >
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Create Activity"
        open={isActivityModalOpen}
        onOk={handleActivityOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Activity name"
          value={activityInputValue}
          onChange={(e) => setActivityInputValue(e.target.value)}
        />
      </Modal>
    </Layout>
  );
}
