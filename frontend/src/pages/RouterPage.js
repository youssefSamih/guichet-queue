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

  const signout = async () => {
    await logout();

    window.location.reload();
  };

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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/desk">Patients</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              <Link to="/line">File d'attente de billets</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              <Link to="/create">Créer des billets</Link>
            </Menu.Item>

            {isAdmin ? (
              <Menu.Item key="4" icon={<UsergroupAddOutlined />}>
                <Link to="/users">Les Utilisateurs</Link>
              </Menu.Item>
            ) : undefined}

            <Menu.Item
              onClick={signout}
              key={isAdmin ? "6" : "5"}
              icon={<CloseCircleOutlined />}
            >
              <div>Sortir</div>
            </Menu.Item>
          </Menu>
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
