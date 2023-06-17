import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Typography, Button, Divider, Form, Avatar } from "antd";
import {
  CloseCircleOutlined,
  RightOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Redirect, useHistory } from "react-router-dom";

import { SocketContext } from "../context/SocketContext";
import { useHideMenu } from "../hooks/useHideMenu";

import { getUserProfile, logout } from "../helpers/auth";
import { updateUser } from "../helpers/users";
import { UserForm } from "./user-form";

const { Title, Text } = Typography;

export const Desk = () => {
  const [form] = Form.useForm();

  const [hideMenu, setHideMenu] = useState(true);

  const history = useHistory();

  useHideMenu(hideMenu);

  const [userData, setUserData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const { socket } = useContext(SocketContext);

  const [ticket, setTicket] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onFinish(values) {
    if (!userData) return;

    const user = await updateUser({
      id: userData.id,
      username: values.email,
      logName: values.username,
      password: values.password,
      images: values.image,
    });

    const hasErrors =
      Array.isArray(user) && user?.some((usr) => usr.errors.length > 0);

    hasErrors && form.setFields(user);

    !hasErrors && setIsModalOpen(false);

    !hasErrors &&
      userData &&
      setUserData((prevState) => ({
        ...prevState,
        ...user,
      }));

    setIsLoading(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  const signout = async () => {
    await logout();

    history.replace("/login");
  };

  const nextTicket = () => {
    socket.emit("next-ticket-work", userData, (ticket) => {
      setTicket(ticket);
    });
  };

  function onOpenModal() {
    if (!userData) return;

    form.setFieldsValue({
      username: userData.logName,
      email: userData.username,
      image: undefined,
    });

    setIsModalOpen(true);
  }

  async function init() {
    const user = await getUserProfile();

    setHideMenu(user.role !== "admin");

    setUserData(user);

    setIsLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  if (!isLoading && (!userData?.username || !userData?.desk)) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <UserForm
        form={form}
        isModalOpen={isModalOpen}
        userEdit={userData}
        onFinish={onFinish}
        handleCancel={handleCancel}
      />

      <Row>
        <Col span={18}>
          <div
            style={{
              display: "flex",
            }}
          >
            <Avatar
              size={70}
              src={userData?.imgProfile || ""}
              style={{
                marginRight: 10,
              }}
            />

            <Title level={2}>{userData?.logName}</Title>
          </div>
          <Text>Vous travaillez sur le bureau: </Text>
          <Text type="success"> {userData?.desk} </Text>
        </Col>

        <Col span={2} align="right">
          <Button shape="round" type="danger" onClick={signout}>
            <CloseCircleOutlined />
            Sortir
          </Button>
        </Col>

        <Col
          style={{
            marginLeft: 20,
          }}
          span={2}
          align="right"
        >
          <Button shape="round" onClick={onOpenModal}>
            <ProfileOutlined />
            Update Profile
          </Button>
        </Col>
      </Row>

      <Divider />

      {ticket && (
        <Row>
          <Col>
            <Text>Vous avez affaire à un numéro de ticket: </Text>
            <Text style={{ fontSize: 30 }} type="danger">
              {ticket.numero}
            </Text>
          </Col>
        </Row>
      )}

      <Row>
        <Col offset={18} span={6} align="right">
          <Button onClick={nextTicket} shape="round" type="primary">
            <RightOutlined />
            Suivant
          </Button>
        </Col>
      </Row>
    </>
  );
};
