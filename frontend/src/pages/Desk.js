import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Typography, Button, Divider } from "antd";
import { CloseCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Redirect, useHistory } from "react-router-dom";

import { SocketContext } from "../context/SocketContext";
import { useHideMenu } from "../hooks/useHideMenu";

import { getUserStorage } from "../helpers/getUserStorage";

const { Title, Text } = Typography;

export const Desk = () => {
  const [hideMenu, setHideMenu] = useState(true);

  useHideMenu(hideMenu);

  const [userData] = useState(getUserStorage());
  const { socket } = useContext(SocketContext);
  const [ticket, setTicket] = useState(null);
  const history = useHistory();

  const signout = () => {
    localStorage.clear();

    history.replace("/login");
  };

  const nextTicket = () => {
    socket.emit("next-ticket-work", userData, (ticket) => {
      setTicket(ticket);
    });
  };

  useEffect(() => {
    const userStorage = getUserStorage();

    setHideMenu(userStorage.role !== "admin");
  }, []);

  if (!userData.agent || !userData.desk) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Row>
        <Col span={20}>
          <Title level={2}>{userData.agent}</Title>
          <Text>Vous travaillez sur le bureau: </Text>
          <Text type="success"> {userData.desk} </Text>
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
