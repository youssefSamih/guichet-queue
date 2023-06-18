import React, { useContext, useState, useEffect, useRef } from "react";
import { Button, Col, Row, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import { useHideMenu } from "../hooks/useHideMenu";
import { SocketContext } from "../context/SocketContext";
import { getUserProfile } from "../helpers/auth";

const { Title, Text } = Typography;

export const CreateTicket = () => {
  const [hideMenu, setHideMenu] = useState(true);

  useHideMenu(hideMenu);

  const ref = useRef(null);
  const { socket } = useContext(SocketContext);
  const [ticket, setTicket] = useState(null);

  function printSection() {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      "<style>@media print { @page { size: A5; } div { margin-top: 200px; transform: scale(2); } }</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write('<div style="padding: 20px;">');
    printWindow.document.write(ref.current.innerHTML);
    printWindow.document.write("</div></body></html>");
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  }

  const nuevoTicket = () => {
    socket.emit("request-ticket", null, (ticket) => {
      setTicket(ticket);

      setTimeout(printSection, 30);
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
        <div ref={ref}>
          <Row style={{ marginTop: 100 }}>
            <Col span={14} offset={6} align="center">
              <Text level={2}>Ticket numero</Text>
              <br />
              <Text type="success" style={{ fontSize: 55 }}>
                {ticket.numero}
              </Text>
            </Col>
          </Row>
        </div>
      ) : undefined}
    </>
  );
};
