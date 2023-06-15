import React, { useContext, useState, useEffect } from "react";
import { Button, Col, Row, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import { useHideMenu } from "../hooks/useHideMenu";
import { SocketContext } from "../context/SocketContext";
import { getUserProfile } from "../helpers/auth";

const { Title, Text } = Typography;

export const CreateTicket = () => {
  const [hideMenu, setHideMenu] = useState(true);

  useHideMenu(hideMenu);

  const { socket } = useContext(SocketContext);
  const [ticket, setTicket] = useState(null);

  const nuevoTicket = () => {
    socket.emit("request-ticket", null, (ticket) => {
      setTicket(ticket);
    });
  };

  async function init() {
    const userData = await getUserProfile();

    setHideMenu(userData?.role !== "admin");
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Row>
        <Col span={14} offset={6} align="center">
          <Title level={3}>Appuyez sur le bouton pour un nouveau ticket</Title>

          <Button
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
            size="large"
            onClick={nuevoTicket}
          >
            Nouveau billet
          </Button>
        </Col>
      </Row>

      {ticket ? (
        <Row style={{ marginTop: 100 }}>
          <Col span={14} offset={6} align="center">
            <Text level={2}>Son numéro</Text>
            <br />
            <Text type="success" style={{ fontSize: 55 }}>
              {ticket.numero}
            </Text>
          </Col>
        </Row>
      ) : undefined}
    </>
  );
};
