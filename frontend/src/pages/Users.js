import { Table, Button, Divider, Modal, Form, Input, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { getUserStorage } from "../helpers/getUserStorage";
import { getAllUsers } from "../helpers/auth";

export const Users = () => {
  const [users, setUsers] = useState([]);

  const [isMounted, setIsMounted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loggedUser, setLoggedUser] = useState();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Bureau",
      dataIndex: "desk",
      key: "desk",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const dataSource = users.map((user) => ({
    ...user,
    key: user.id,
    action: (
      <Space wrap>
        <Button
          danger
          shape="circle"
          type="primary"
          icon={<DeleteOutlined />}
        />
        <Button ghost shape="circle" type="primary" icon={<EditOutlined />} />
      </Space>
    ),
  }));

  function onOpenModal(params) {
    setIsModalOpen(true);
  }

  function handleOk() {
    setIsModalOpen(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function init(actualUser) {
    setIsLoading(true);

    const users = await getAllUsers();

    const filteredUsers = users?.filter(
      (user) => user.email !== actualUser?.email
    );

    filteredUsers && setUsers(filteredUsers);

    setIsLoading(false);
  }

  useEffect(() => {
    if (isMounted) return;

    setIsMounted(true);

    const userStorage = getUserStorage();

    userStorage && setLoggedUser(userStorage);

    init(userStorage);
  }, [init, isMounted]);

  if (isMounted && !loggedUser?.role) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Modal
        title="Ajouter un utilisateur"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Annuler"
        okText="Ajouter"
      >
        <Form
          name="basic"
          // ref={ref}
          className="form"
          onFinish={() => {}}
          onFinishFailed={() => {}}
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
            label="Bureau"
            name="desk"
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            type="password"
            className="input-container"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Button onClick={onOpenModal} type="primary">
        Ajouter un utilisateur
      </Button>

      <Divider />

      <Table loading={isLoading} dataSource={dataSource} columns={columns} />
    </>
  );
};
