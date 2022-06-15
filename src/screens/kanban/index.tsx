import styled from "@emotion/styled";
import { Spin } from "antd";
import { ScreenContainer } from "components/lib";
import React, { useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { SearchPanel } from "screens/kanban/search-panel";
import { useDebounce, useDocumentTitle } from "utils";
import { useKanbans, useReorderKanban } from "utils/kanban";
import { useReorderTask, useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-column";
import { TaskModal } from "./task-model";
import { Drag, Drop, DropChild } from "components/drag-and-drop";
import {
  useKanbansQueryKey,
  useKanbansSearchParams,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from "./util";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const param = useKanbansSearchParams();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbansSearchParams()
  );
  const { isLoading: taskLoading } = useTasks(useTasksSearchParams());
  const isLoading = taskLoading || kanbanIsLoading;

  const onDragEnd = useDragEnd();

  return (
    <DragDropContext
      onDragEnd={(param) => {
        return onDragEnd({ ...param });
      }}
    >
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          // <ColumnsContainer>
          <FlexContainer>
            <Drop
              type={"COLUMN"}
              direction={"horizontal"}
              droppableId={"kanban"}
            >
              <ColumnsContainer style={{ minHeight: "5px" }}>
                {kanbans?.map((kanban, index) => (
                  <Drag
                    key={kanban.id}
                    draggableId={String(kanban.id)}
                    index={index}
                  >
                    <KanbanColumn key={kanban.id} kanban={kanban} />
                  </Drag>
                ))}
              </ColumnsContainer>
            </Drop>
            <CreateKanban />
          </FlexContainer>
          //  </ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};

// source : 拖动的Item destination: 拖动后的目标位置
export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbansSearchParams());
  const { mutate: reorderKanban } = useReorderKanban(useKanbansQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams());

  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) return;
      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) return;
        const type = destination.index > source.index ? "after" : "before";
        reorderKanban({ fromId, referenceId: toId, type });
      }
      // task排序
      if (type === "ROW") {
        const fromKanbanId = Number(source.droppableId);
        const toKanbanId = Number(destination.droppableId);
        const fromTask = allTasks?.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const toTask = allTasks?.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];

        // 拖拽task到原位置
        if (fromTask?.id === toTask?.id) return;
        reorderTask({
          fromId: fromTask.id,
          referenceId: toTask.id,
          fromKanbanId,
          toKanbanId,
          type: destination.index > source.index ? "after" : "before",
        });
      }
    },
    [kanbans, reorderKanban, allTasks, reorderTask]
  );
};

const ColumnsContainer = styled(DropChild)`
  display: flex;
  flex: 1;
`;

const FlexContainer = styled(DropChild)`
  display: flex;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  flex: 1;
`;
