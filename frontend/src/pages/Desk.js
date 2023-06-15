import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Typography, Button, Divider } from "antd";
import { CloseCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Redirect, useHistory } from "react-router-dom";

import { SocketContext } from "../context/SocketContext";
import { useHideMenu } from "../hooks/useHideMenu";

import { getUserProfile } from "../helpers/auth";

const { Title, Text } = Typography;

export const Desk = () => {
  const [hideMenu, setHideMenu] = useState(true);

  const history = useHistory();
  useHideMenu(hideMenu);

  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useContext(SocketContext);
  const [ticket, setTicket] = useState(null);

  const signout = () => {
    localStorage.clear();

    history.replace("/login");
  };

  const nextTicket = () => {
    socket.emit("next-ticket-work", userData, (ticket) => {
      setTicket(ticket);
    });
  };

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
      <Row>
        <Col span={20}>
          <Title level={2}>{userData?.logName}</Title>
          <Text>Vous travaillez sur le bureau: </Text>
          <Text type="success"> {userData?.desk} </Text>
        </Col>

        <Col span={4} align="right">
          <Button shape="round" type="danger" onClick={signout}>
            <CloseCircleOutlined />
            Sortir
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
