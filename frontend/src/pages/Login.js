import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";

import { useHideMenu } from "../hooks/useHideMenu";
import { getUserProfile } from "../helpers/auth";
import { login } from "../helpers/auth";

export const Login = () => {
  useHideMenu(true);

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef(null);

  const errors = {
    email: "Email invalide",
    password: "Mot de passe incorrect",
  };

  const onFinish = async ({ email, password }) => {
    // Find user login info
    const fieldErrors = [];

    // Compare user info

    // Invalid password
    !email &&
      errors.push([
        {
          name: "email",
          errors: [errors.email],
        },
      ]);

    // Invalid password
    !password &&
      errors.push([
        {
          name: "password",
          errors: [errors.password],
        },
      ]);

    setIsLoading(true);

    const userData = await login(email, password);

    setIsLoading(false);

    const hasErrors =
      Array.isArray(userData) &&
      userData?.some((user) => user.errors.length > 0);

    if (hasErrors) fieldErrors.push(...userData);

    if (fieldErrors.length > 0) return ref.current?.setFields(fieldErrors);

    if (userData?.role === "admin") return history.push("/line");

    history.push("/desk");
  };

  const onFinishFailed = () => {
    // eslint-disable-next-line no-unused-expressions
    ref.current?.setFields([
      {
        name: "uname",
        errors: [errors.uname],
      },
      {
        name: "password",
        errors: [errors.pass],
      },
    ]);
  };

  async function init() {
    setIsLoading(true);

    const userData = await getUserProfile();

    setIsLoading(false);

    if (!userData?.role) return;

    history.push(userData.role ? "/line" : "/desk");
  }

  useEffect(() => {
    init();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="title">S'identifier</div>

        <Form
          name="basic"
          ref={ref}
          className="form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            className="input-container"
            rules={[{ required: true, message: errors.uname }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            type="password"
            className="input-container"
            rules={[{ required: true, message: errors.pass }]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="button-container">
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              shape="round"
            >
              <LockOutlined />
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
