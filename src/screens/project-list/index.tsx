import React from "react";
import { List } from "./list";
import { SearchPanel } from "./search_panel";
import { useDebounce, useDocumentTitle } from "utils";
import styled from "@emotion/styled";
import { Button, Typography, Row } from "antd";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectSearchParam } from "./util";
import { ButtonNoPadding, ErrorBox } from "components/lib";

export const ProjectListScreen = () => {
  // 基本类型可以放到依赖里,组件状态可以放到依赖里,非组件状态的对象,绝不可以放到依赖里 ,会造成无限循环
  useDocumentTitle("项目列表", false);
  const [param, setParam] = useProjectSearchParam();
  const {
    isLoading,
    error,
    data: list,
    // retry,
  } = useProjects(useDebounce(param, 200));
  // 给data属性取别名为users
  const { data: users } = useUsers();
  const { open } = useProjectModal();
  return (
    <Container>
      <Row justify={"space-between"} align={"middle"}>
        <h1>项目列表</h1>
        <ButtonNoPadding onClick={open} type={"link"}>
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? <ErrorBox error={error} /> : null}
      <List
        // projectButton={props.projectButton}
        // refresh={() => retry()}
        users={users || []}
        dataSource={list || []}
        loading={isLoading}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
// ProjectListScreen.whyDidYouRender = true;
