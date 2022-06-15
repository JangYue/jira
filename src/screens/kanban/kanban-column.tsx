import React from "react";
import { Kanban } from "types/kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import {
  useKanbansQueryKey,
  useTasksModal,
  useTasksSearchParams,
} from "./util";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Card, Menu, Button, Dropdown, Modal } from "antd";
import { CreateTask } from "./create-task";
import { Task } from "types/task";
import { Mark } from "components/mark";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import { Drop, DropChild, Drag } from "components/drag-and-drop";

export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  // 虽然外面是循环 但这里只会请求一次
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);

  return (
    <Container {...props} ref={ref}>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id} />
      </Row>
      <TasksContainer>
        <Drop
          type={"ROW"}
          direction={"vertical"}
          droppableId={String(kanban.id)}
        >
          <DropChild>
            {tasks?.map((task, taskIndex) => (
              <Drag
                key={task.id}
                index={taskIndex}
                draggableId={String(task.id)}
              >
                {/* 使用div可以自动转发ref,就不需要用forwardRef了 */}
                <div>
                  <TaskCard key={task.id} task={task} />
                </div>
              </Drag>
            ))}
          </DropChild>
        </Drop>
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  );
});

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const { name: keyword } = useTasksSearchParams();
  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: "0.5rem" }}
      key={task.id}
    >
      <div key={task.id}>
        <Mark key={task.id} keyword={keyword} name={task.name} />
      </div>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) return null;
  return <Image src={name === "task" ? taskIcon : bugIcon} alt={"icon图标"} />;
};

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());
  const startDelete = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗",
      onOk() {
        return mutateAsync({ id: kanban.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item key={"delete"}>
        <Button onClick={startDelete} type={"link"}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown key={"drapdown"} overlay={overlay}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

const Image = styled.img`
  width: 2rem;
  height: 2rem;
`;
export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;
const TasksContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;
