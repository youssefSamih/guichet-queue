import React, { useContext, useEffect, useState } from "react";

import {
  Col,
  Row,
  Typography,
  List,
  Card,
  Tag,
  Divider,
  Avatar,
  Space,
} from "antd";

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
      const deskMap = new Map();

      // Iterate over the tickets array to find the latest numero for each desk
      for (const assign of assigned) {
        const { desk, numero, logName, imgProfile } = assign;
        if (!deskMap.has(desk) || numero > deskMap.get(desk).numero) {
          deskMap.set(desk, { numero, logName, imgProfile });
        }
      }

      // Create an array of unique desk values with the latest numero
      const uniqueDesks = Array.from(deskMap.entries()).map(([desk, data]) => ({
        desk,
        numero: data.numero,
        logName: data.logName,
        imgProfile: data.imgProfile,
      }));

      setTickets(uniqueDesks);
    });

    return () => {
      socket.off("ticket-assigned");
    };
  }, [socket]);

  useEffect(() => {
    getLastTickets().then((assigned) => {
      const deskMap = new Map();

      // Iterate over the tickets array to find the latest numero for each desk
      for (const assign of assigned) {
        const { desk, numero, logName, imgProfile } = assign;
        if (!deskMap.has(desk) || numero > deskMap.get(desk).numero) {
          deskMap.set(desk, { numero, logName, imgProfile });
        }
      }

      // Create an array of unique desk values with the latest numero
      const uniqueDesks = Array.from(deskMap.entries()).map(([desk, data]) => ({
        desk,
        numero: data.numero,
        logName: data.logName,
        imgProfile: data.imgProfile,
      }));

      setTickets(uniqueDesks);
    });

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
                    <Space wrap size={16}>
                      <Avatar
                        size={70}
                        src={item?.imgProfile || ""}
                        style={{ marginRight: 10 }}
                      />

                      <Title> No. {item.numero}</Title>
                    </Space>
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
                      <Avatar
                        size={70}
                        src={item?.imgProfile || ""}
                        style={{ marginRight: 10 }}
                      />
                      <Text type="secondary">Au bureau: </Text>
                      <Tag color="magenta"> {item.desk} </Tag>
                      <Text type="secondary"> Agent: </Text>
                      <Tag color="volcano"> {item.logName} </Tag>
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
