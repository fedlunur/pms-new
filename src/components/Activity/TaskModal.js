import React from 'react';
import { Modal, Input, DatePicker, Button, Form } from 'antd';
import dayjs from 'dayjs';

const TaskModal = ({ isModalOpen, handleOk, handleCancel, addTodo, inputValue, setInputValue, startDate, endDate, handleDateChangestart, handleDateChange, canAdd }) => {
  const [form] = Form.useForm();
  const dateFormat = 'YYYY-MM-DD';

  return (
    <Modal
      title="Add Task"
      open={isModalOpen}
      onOk={() => form.submit()} // Submit the form when clicking OK
      onCancel={handleCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={addTodo} // Trigger addTodo on form submission
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
            onChange={(date, dateString) => {
              handleDateChangestart(dateString);
              form.setFieldsValue({ startDate: dateString });
            }}
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
            onChange={(date, dateString) => {
              handleDateChange(dateString);
              form.setFieldsValue({ endDate: dateString });
            }}
            format={dateFormat}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            className="mt-4"
            htmlType="submit" // Use htmlType="submit" to trigger form submission
            disabled={!inputValue.trim() || !canAdd}
          >
            Add Task
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
