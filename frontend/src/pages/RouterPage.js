import React, { useContext, useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  CloseCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import { Login } from "./Login";
import { Line } from "./Line";
import { CreateTicket } from "./CreateTicket";
import { Desk } from "./Desk";
import { UiContext } from "../context/UiContext";
import { logout, getUserProfile } from "../helpers/auth";
import { Users } from "./Users";

const { Sider, Content } = Layout;

export const RouterPage = () => {
  const { ocultarMenu } = useContext(UiContext);

  const [isAdmin, setIsAdmin] = useState(true);

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/desk">Patients</Link>,
      shouldShow: true,
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: <Link to="/line">File d'attente de billets</Link>,
      shouldShow: true,
    },
    {
      key: "3",
      icon: <UploadOutlined />,
      label: <Link to="/create">Créer des billets</Link>,
      shouldShow: true,
    },
    {
      key: "4",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/users">Les Utilisateurs</Link>,
      shouldShow: isAdmin,
    },
    {
      key: isAdmin ? "6" : "5",
      icon: <CloseCircleOutlined />,
      label: <div onClick={signout}>Sortir</div>,
      shouldShow: isAdmin,
    },
  ];

  async function signout() {
    await logout();

    window.location.reload();
  }

  async function init() {
    const user = await getUserProfile();

    setIsAdmin(user?.role === "admin");
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsedWidth="0" breakpoint="md" hidden={ocultarMenu}>
          <div className="logo" />
          <Menu
            items={menuItems}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["2"]}
          />
        </Sider>
        <Layout className="site-layout">
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/line" component={Line} />
              <Route path="/create" component={CreateTicket} />
              <Route path="/users" component={Users} />

              <Route path="/desk" component={Desk} />

              <Redirect to="/login" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
