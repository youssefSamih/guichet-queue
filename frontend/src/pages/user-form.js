import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Upload } from "antd";
import React, { useRef } from "react";

export const UserForm = ({
  userEdit,
  isModalOpen,
  handleCancel,
  isLoading,
  onFinish,
  form,
}) => {
  const ref = useRef(null);

  function getFile(e) {
    if (Array.isArray(e)) return e;

    return e && e.fileList;
  }

  return (
    <Modal
      title={
        userEdit ? `Modifier ${userEdit.logName}` : "Ajouter un utilisateur"
      }
      open={isModalOpen}
      onOk={form.submit}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      cancelText="Annuler"
      okText={userEdit ? "Modifier" : "Ajouter"}
    >
      <Form
        autoComplete="off"
        form={form}
        name="basic"
        className="form"
        onFinish={onFinish}
      >
        <Form.Item
          label="Nom d'utilisateur"
          name="username"
          className="input-container"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          className="input-container"
          rules={[{ required: true }]}
        >
          <Input disabled={!!userEdit} />
        </Form.Item>

        {!userEdit ? (
          <Form.Item
            label="Mot de passe"
            name="password"
            type="password"
            className="input-container"
            rules={[{ required: !userEdit }]}
          >
            <Input type="password" />
          </Form.Item>
        ) : undefined}

        <Form.Item
          className="input-container"
          name="image"
          getValueFromEvent={getFile}
        >
          <Upload
            accept="image/png, image/jpeg"
            fileList={form.getFieldValue("image")}
            ref={ref}
            multiple={false}
            maxCount={1}
            onRemove={(file) => {
              const index = form.getFieldValue("image").indexOf(file);
              const newFileList = form.getFieldValue("image").slice();
              newFileList.splice(index, 1);
              form.setFieldValue("image", newFileList);
            }}
            beforeUpload={(file) => {
              form.setFieldValue("image", [
                ...form.getFieldValue("image"),
                file,
              ]);

              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
