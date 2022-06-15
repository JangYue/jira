import React from "react";
import { Dropdown, Menu, Table, Modal } from "antd";
import dayjs from "dayjs";
import { User } from "types/user";
import { TableProps } from "antd/es/table";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useDeleteProject, useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import { useProjectModal, useProjectsQueryKey } from "./util";
import { Project } from "types/project";

// 把所有id都改为Number类型

interface ListProps extends TableProps<Project> {
  users: User[];
  // refresh: () => void;
  // projectButton: JSX.Element;
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  return (
    <Table
      pagination={false}
      rowKey={"id"}
      columns={[
        {
          title: <Pin checked={true} disabled={true}></Pin>,
          key: "pin",
          dataIndex: "pin",
          render(value, project) {
            return (
              // 这里的pin是
              <Pin
                checked={project.pin}
                onCheckedChange={(pin) => {
                  // mutate({ id: project.id, pin }).then(props.refresh);
                  mutate({ id: project.id, pin });
                }}
              ></Pin>
            );
          },
        },
        {
          title: "名称",
          key: "name",
          dataIndex: "name",
          render: (value, project) => {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "部门",
          key: "organization",
          dataIndex: "organization",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "负责人",
          key: "personId",
          dataIndex: "personId",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          key: "created",
          dataIndex: "created",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "确定删除这个项目吗?",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject({ id });
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          {/* <Menu.Item key={"edit"}>{props.projectButton}</Menu.Item> */}
          <Menu.Item key={"edit"} onClick={editProject(project.id)}>
            编辑
          </Menu.Item>
          <Menu.Item
            key={"delete"}
            onClick={() => confirmDeleteProject(project.id)}
          >
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};
