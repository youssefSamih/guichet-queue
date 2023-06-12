import React, { useContext, useEffect, useState } from "react";

import { Col, Row, Typography, List, Card, Tag, Divider } from "antd";

import { SocketContext } from "../context/SocketContext";
import { useHideMenu } from "../hooks/useHideMenu";
import { getLastTickets } from "../helpers/getLastTickets";
import { getUserStorage } from "../helpers/getUserStorage";

const { Title, Text } = Typography;

export const Line = () => {
  const [hideMenu, setHideMenu] = useState(true);

  useHideMenu(hideMenu);

  const { socket } = useContext(SocketContext);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    socket.on("ticket-assigned", (assigned) => {
      setTickets(assigned);
    });

    return () => {
      socket.off("ticket-assigned");
    };
  }, [socket]);

  useEffect(() => {
    getLastTickets().then(setTickets);

    const userStorage = getUserStorage();

    setHideMenu(userStorage.role !== "admin");
  }, []);

  return (
    <>
      <Title level={1}>Servir le client</Title>
      <Row>
        <Col span={12}>
          <List
            dataSource={tickets.slice(0, 3)}
            renderItem={(item) => (
              <List.Item>
                <Card
                  style={{ width: 300, marginTop: 16 }}
                  actions={[
                    <Tag color="volcano"> {item.agent} </Tag>,
                    <Tag color="magenta"> Bureau: {item.desk} </Tag>,
                  ]}
                >
                  <Title> No. {item.numero}</Title>
                </Card>
              </List.Item>
            )}
          />
        </Col>

        <Col span={12}>
          <Divider> Enregistrer </Divider>
          <List
            dataSource={tickets.slice(3)}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={`Ticket No. ${item.numero}`}
                  description={
                    <>
                      <Text type="secondary">Au bureau: </Text>
                      <Tag color="magenta"> {item.numero} </Tag>
                      <Text type="secondary"> Agent: </Text>
                      <Tag color="volcano"> {item.agent} </Tag>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
