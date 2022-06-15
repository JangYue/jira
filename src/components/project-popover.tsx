// 点击项目出现的选项
import styled from "@emotion/styled";
import { Button, Divider, List, Popover, Typography } from "antd";
import React from "react";
import { useProjectModal } from "screens/project-list/util";
import { resolveProjectReferencePath } from "typescript";
import { useProjects } from "utils/project";
import { ButtonNoPadding } from "./lib";

export const ProjectPopover = () => {
  const { data: project, refetch } = useProjects();
  const pinnedProjects = project?.filter((project) => project.pin);
  const { open } = useProjectModal();
  const content = (
    <Container>
      <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      {/* {props.projectButton} */}
      <ButtonNoPadding onClick={open} type={"link"}>
        创建项目
      </ButtonNoPadding>
    </Container>
  );
  return (
    <Popover
      onVisibleChange={() => refetch()}
      placement={"bottom"}
      content={content}
    >
      <span>项目</span>
    </Popover>
  );
};

const Container = styled.div`
  min-width: 25rem;
`;
