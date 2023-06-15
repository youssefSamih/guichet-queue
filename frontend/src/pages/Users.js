import { Table, Button, Divider, Modal, Form, Input, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { createUser, deleteUser, updateUser } from "../helpers/users";
import { getUserProfile, getAllUsers } from "../helpers/auth";

export const Users = () => {
  const [form] = Form.useForm();

  const [users, setUsers] = useState([]);

  const [isMounted, setIsMounted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [deleteId, setDeleteId] = useState();

  const [userEdit, setUserEdit] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loggedUser, setLoggedUser] = useState();

  const columns = [
    {
      title: "Name",
      dataIndex: "logName",
      key: "logName",
    },
    {
      title: "Email",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const dataSource = users.map((user) => ({
    ...user,
    logName:
      user.username === loggedUser?.username
        ? `${user.logName} (vous)`
        : user.logName,
    key: user._id,
    action: (
      <Space wrap>
        {user.username !== loggedUser?.username &&
        loggedUser?.role === "admin" ? (
          <Button
            danger
            loading={isLoading && deleteId}
            disabled={isLoading}
            onClick={() => onDelete(user._id)}
            shape="circle"
            type="primary"
            icon={<DeleteOutlined />}
          />
        ) : undefined}

        <Button
          ghost
          disabled={isLoading}
          onClick={() => onEdit(user)}
          shape="circle"
          type="primary"
          icon={<EditOutlined />}
        />
      </Space>
    ),
  }));

  async function onEdit(userData) {
    setUserEdit(userData);

    setIsModalOpen(true);

    form.setFieldsValue({
      username: userData.logName,
      email: userData.username,
    });
  }

  async function onDelete(id) {
    setIsLoading(true);

    setDeleteId(id);

    const user = await deleteUser(id);

    const hasErrors =
      Array.isArray(user) && user?.some((usr) => usr.errors.length > 0);

    !hasErrors &&
      setUsers((prevState) => prevState.filter((usr) => usr._id !== id));

    setDeleteId(undefined);

    setIsLoading(false);
  }

  function onOpenModal(params) {
    userEdit && setUserEdit(undefined);

    userEdit && form.setFieldsValue({ username: "", email: "", password: "" });

    setIsModalOpen(true);
  }

  async function onFinish(values) {
    setIsLoading(true);

    const user = userEdit
      ? await updateUser({
          id: userEdit._id,
          username: values.email,
          logName: values.username,
          password: values.password,
        })
      : await createUser(values.username, values.email, values.password);

    const hasErrors =
      Array.isArray(user) && user?.some((usr) => usr.errors.length > 0);

    hasErrors && form.setFields(user);

    !hasErrors && setIsModalOpen(false);

    !hasErrors && !userEdit && setUsers((prevState) => [...prevState, user]);

    !hasErrors && userEdit && setUserEdit(undefined);

    !hasErrors &&
      userEdit &&
      setUsers((prevState) =>
        prevState.map((user) => {
          if (user._id === userEdit._id) {
            return {
              _id: user._id,
              logName: values.username,
              username: values.username,
            };
          }

          return user;
        })
      );

    setIsLoading(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function init() {
    setIsLoading(true);

    const userData = await getUserProfile();

    userData?.username && setLoggedUser(userData);

    const users = await getAllUsers();

    users &&
      setUsers(
        userData?.role === "admin"
          ? users
          : users.filter((user) => user._id === userData?.id)
      );

    setIsLoading(false);
  }

  useEffect(() => {
    if (isMounted) return;

    setIsMounted(true);

    init();
  }, [init, isMounted]);

  if (!isLoading && isMounted && !loggedUser?.role) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Modal
        title={
          userEdit ? `Modifier ${userEdit.logName}` : "Ajouter un utilisateur"
        }
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        cancelText="Annuler"
        okText={userEdit ? "Modifier" : "Ajouter"}
      >
        <Form
          autoComplete="off"
          form={form}
          name="basic"
          className="form"
          onFinish={onFinish}
        >
          <Form.Item
            label="Nom d'utilisateur"
            name="username"
            className="input-container"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            className="input-container"
            rules={[{ required: true }]}
          >
            <Input disabled={!!userEdit} />
          </Form.Item>

          {!userEdit ? (
            <Form.Item
              label="Mot de passe"
              name="password"
              type="password"
              className="input-container"
              rules={[{ required: !userEdit }]}
            >
              <Input type="password" />
            </Form.Item>
          ) : undefined}
        </Form>
      </Modal>

      <Button loading={isLoading} onClick={onOpenModal} type="primary">
        Ajouter un utilisateur
      </Button>

      <Divider />

      <Table loading={isLoading} dataSource={dataSource} columns={columns} />
    </>
  );
};
