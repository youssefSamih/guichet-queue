import React, { useContext, useEffect, useState } from "react";

import { Col, Row, Typography, List, Card, Tag, Divider } from "antd";

import { SocketContext } from "../context/SocketContext";
import { useHideMenu } from "../hooks/useHideMenu";
import { getLastTickets } from "../helpers/getLastTickets";
import { getUserProfile } from "../helpers/auth";

const { Title, Text } = Typography;

export const Line = () => {
  const [hideMenu, setHideMenu] = useState(false);

  useHideMenu(hideMenu);

  const { socket } = useContext(SocketContext);
  const [tickets, setTickets] = useState([]);

  async function init() {
    const user = await getUserProfile();

    setHideMenu(user?.role !== "admin");
  }

  useEffect(() => {
    socket.on("ticket-assigned", (assigned) => {
      // Create a Map to store the latest numero for each desk
      const deskMap = new Map();

      // Iterate over the tickets array to find the latest numero for each desk
      for (const assign of assigned) {
        const { desk, numero } = assign;
        if (!deskMap.has(desk) || numero > deskMap.get(desk)) {
          deskMap.set(desk, numero);
        }
      }

      // Create an array of unique desk values with the latest numero
      const uniqueDesks = Array.from(deskMap.entries()).map(
        ([desk, numero]) => ({ desk, numero })
      );

      setTickets(uniqueDesks);
    });

    return () => {
      socket.off("ticket-assigned");
    };
  }, [socket]);

  useEffect(() => {
    getLastTickets().then(setTickets);

    init();
  }, []);

  return (
    <>
      <Title level={1}>Servir le client</Title>
      <Row>
        <Col span={12}>
          <List
            dataSource={tickets.slice(0, 3)}
            renderItem={(item) => {
              return (
                <List.Item>
                  <Card
                    style={{ width: 300, marginTop: 16 }}
                    actions={[
                      <Tag color="volcano"> {item.logName} </Tag>,
                      <Tag color="magenta"> Bureau: {item.desk} </Tag>,
                    ]}
                  >
                    <Title> No. {item.numero}</Title>
                  </Card>
                </List.Item>
              );
            }}
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
