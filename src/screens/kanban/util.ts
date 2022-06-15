import { useLocation } from "react-router";
import { useProject } from "utils/project";
import { useUrlQueryParam } from "utils/url";
import { useCallback, useMemo } from "react";
import { useTask } from "utils/task";
import { useDebounce } from "utils";

// 获取项目ID
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};
export const useProjectInUrl = () => useProject(useProjectIdInUrl());

// 特定kanban请求的id参数
export const useKanbansSearchParams = () => ({
  projectId: useProjectIdInUrl(),
});

// kanban在react-query中缓存的queryKey
export const useKanbansQueryKey = () => ["kanbans", useKanbansSearchParams()];

// 特定tasks请求的id参数
export const useTasksSearchParams = () => {
  const [param] = useUrlQueryParam(["name", "typeId", "processorId", "tagId"]);
  const projectId = useProjectIdInUrl();
  const debounceName = useDebounce(param.name, 200);
  //   const [debouncedValue, setDebouncedValue] = useState(param.name);
  //   const debounceName = useDebounce(param?.name,200);

  //   useEffect(
  //     () => {
  //       const timeout = setTimeout(() => setDebouncedValue(debouncedValue), 200);
  //       return () => clearTimeout(timeout);
  //       },
  //     [projectId,param,debouncedValue]
  //   )
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: debounceName,
    }),
    [param, projectId, debounceName]
  );
};

// tasks在react-query中缓存的queryKey
export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];

export const useTasksModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );
  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: "" });
  }, [setEditingTaskId]);
  return {
    editingTask,
    startEdit,
    close,
    isLoading,
    editingTaskId,
  };
};
