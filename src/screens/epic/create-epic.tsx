import { Drawer } from "antd";
import { DrawerProps, Spin, Input, Form, Button } from "antd";
import Reat from "react";
import styled from "@emotion/styled";
import { useAddEpics } from "utils/epic";
import { useEpicsQueryKey } from "./util";
import { useForm } from "antd/es/form/Form";
import { ErrorBox } from "components/lib";
import { useEffect } from "react";
import { useProjectIdInUrl } from "screens/kanban/util";

export const CreateEpic = (
  props: Pick<DrawerProps, "visible"> & { onClose: () => void }
) => {
  const {
    mutateAsync: addEpic,
    isLoading,
    error,
  } = useAddEpics(useEpicsQueryKey());
  const projectId = useProjectIdInUrl();
  const [form] = useForm();
  const onFinish = async (values: any) => {
    await addEpic({ ...values, projectId });
    props.onClose();
  };
  useEffect(() => {
    form.setFields([]);
  }, [form, props]);
  return (
    <Drawer
      visible={props.visible}
      onClose={props.onClose}
      forceRender={true}
      destroyOnClose={true}
      width={"100%"}
    >
      <Container>
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <Container>
            <h1>创建任务组</h1>
            <ErrorBox error={error} />
            <Form
              layout={"vertical"}
              style={{ width: "40rem" }}
              onFinish={onFinish}
              form={form}
            >
              <Form.Item
                label={"名称"}
                name={"name"}
                rules={[{ required: true, message: "请输入任务组名" }]}
              >
                <Input placeholder={"请输入任务组名"} />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ textAlign: "right" }}
                  loading={isLoading}
                  type={"primary"}
                  htmlType={"submit"}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Container>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
