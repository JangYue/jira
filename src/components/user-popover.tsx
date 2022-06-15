// 点击项目出现的选项
import React from "react";
import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import { useUsers } from "utils/user";

export const UserPopover = () => {
  const { data: users, refetch } = useUsers();
  const content = (
    <Container>
      <Typography.Text type={"secondary"}>组员列表</Typography.Text>
      <List>
        {users?.map((user) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name} />
          </List.Item>
        ))}
      </List>
    </Container>
  );
  return (
    <Popover
      onVisibleChange={() => refetch()}
      placement={"bottom"}
      content={content}
    >
      <span>组员</span>
    </Popover>
  );
};

const Container = styled.div`
  min-width: 25rem;
`;
