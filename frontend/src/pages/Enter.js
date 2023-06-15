import React, { useState } from "react";

import { Form, Input, Button, InputNumber, Typography, Divider } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Redirect, useHistory } from "react-router-dom";

import { useHideMenu } from "../hooks/useHideMenu";

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 14 },
};

export const Enter = () => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();

  useHideMenu(false);

  const onFinish = ({ agent, desk }) => {
    localStorage.setItem("agent", agent);
    localStorage.setItem("desk", desk);

    history.push("/desk");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  async function init() {
    const user = await getUserProfile();

    setUserData(user);

    setIsLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  if (!isLoading && userData?.id && userData?.desk) {
    return <Redirect to="/desk" />;
  }

  return (
    <>
      <Title level={2}>Entrer</Title>
      <Text>Entrez votre nom et votre numéro de bureau</Text>
      <Divider />

      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Nom d'agent"
          name="agent"
          rules={[
            { required: true, message: "S'il vous plaît entrez votre nom" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Bureau"
          name="desk"
          rules={[{ required: true, message: "Entrez le numéro du bureau" }]}
        >
          <InputNumber min={1} max={99} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" shape="round">
            <SaveOutlined />
            Entrer
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
