import {
  Button,
  Flex,
  Modal,
  Table,
  Tag,
  Typography,
  Form,
  Input,
  DatePicker,
  message,
  Popconfirm,
  Space,
} from "antd";
import React, { useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import dayjs from "dayjs";

const status = {
  todo: {
    color: "blue",
    text: "To Do",
  },
  in_progress: {
    color: "orange",
    text: "In Progress",
  },
  completed: {
    color: "green",
    text: "Completed",
  },
  cancelled: {
    color: "red",
    text: "Cancelled",
  },
};

const TaskManager = (props) => {
  const [tasks, setTasks] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = React.useState(false);
  const [id, setId] = React.useState(null);

  const fetchData = async () => {
    try {
      const response = await axios({
        url: process.env.REACT_APP_API_URL + "/tasks/",
        method: "get",
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveTask = async (values) => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/tasks/`,
        method: "POST",
        data: {
          title: form.getFieldValue("title"),
          description: form.getFieldValue("description"),
          due_date: moment(form.getFieldValue("due_date")).format("YYYY-MM-DD"),
        },
      });
      setTasks([...tasks, response.data]);
      setOpen(false);
      message.success(
        'Task id "' + response.data.task_id + '" created successfully'
      );
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message || "Something went wrong");
    }
  };

  const deleteTask = async (task_id, id) => {
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/tasks/${task_id}`,
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task.id !== task_id));
      message.success('Task id "' + id + '" deleted successfully');
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message || "Something went wrong");
    }
  };

  const updateTask = async (values) => {
    values.due_date = dayjs(values.due_date).format("YYYY-MM-DD");
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/tasks/${id}`,
        method: "PATCH",
        data: values,
      });
      message.success('Task id "' + id + '" updated successfully');
      setIsEdit(false);
      setOpen(false);
      fetchData();
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.user]);

  return (
    <React.Fragment>
      <Table
        dataSource={tasks}
        pagination={false}
        title={() => (
          <Flex justify="space-between" align="center">
            <Typography.Title level={3}>
              Tasks ({tasks.length})
            </Typography.Title>
            <Button type="default" onClick={() => setOpen(true)}>
              Add Task
            </Button>
          </Flex>
        )}
        columns={[
          {
            title: "Task ID",
            dataIndex: "task_id",
          },
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text) => <p>{text}</p>,
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => <p>{text}</p>,
          },
          {
            title: "Due date",
            dataIndex: "due_date",
            key: "due_date",
            render: (text) => <p>{moment(text).format("DD-MM-YYYY")}</p>,
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text) => (
              <Tag color={status[text].color}>{status[text].text}</Tag>
            ),
          },
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (text, row, value) => (
              <Space>
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => deleteTask(row.id, row.task_id)}
                  onCancel={() => console.log("cancelled")}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    <DeleteFilled />
                  </Button>
                </Popconfirm>
                <Button
                  type="link"
                  onClick={() => {
                    form.setFieldsValue({
                      title: row.title,
                      description: row.description,
                      due_date: dayjs(row.due_date, "YYYY-MM-DD"),
                    });
                    setOpen(true);
                    setIsEdit(true);
                    setId(row.id);
                  }}
                >
                  <EditFilled />
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={isEdit ? "Edit Task" : "Add Task"}
        open={open}
        maskClosable={false}
        onCancel={() => {
          setIsEdit(false);
          setOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            isEdit ? updateTask(values) : saveTask(values)
          }
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Due date"
            name="due_date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default TaskManager;
