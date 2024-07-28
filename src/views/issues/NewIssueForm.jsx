import React from 'react';
import { Input, Button, Form } from 'antd';
import useAxios from "../../utils/useAxios";

function NewIssueForm({ addIssue, taskId, toggleForm }) {
  const [form] = Form.useForm();
  const api = useAxios();

  const handleFinish = async (values) => {
    try {
      const response = await api.post('/issues/', {
        title: values.title,
        description: values.description,
        task: taskId,
      });
      addIssue(response.data);
      form.resetFields();
      toggleForm();
    } catch (error) {
      console.error('Error adding issue:', error);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      style={{ marginBottom: '20px' }}
      layout="vertical"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input the description!' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
}

export default NewIssueForm;
