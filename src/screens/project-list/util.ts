import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProject } from "utils/project";
import { useUrlQueryParam } from "utils/url";

// 项目例表搜索参数

export const useProjectSearchParam = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [params] = useProjectSearchParam();
  return ["projects", params];
};

// 状态管理器
export const useProjectModal = () => {
  // 获取url的参数
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);
  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const open = () => setProjectCreate({ projectCreate: true });
  const closeCreate = () => setProjectCreate({ projectCreate: undefined });
  const closeEdit = () => setEditingProjectId({ editingProjectId: undefined });

  // 编辑某个Id的数据
  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });

  // 返回toople []可以任意取名
  return {
    // @ts-ignore 这两个任意有值时 就打开Modal
    projectModalOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    closeEdit,
    closeCreate,
    startEdit,
    isLoading,
    editingProject,
  };
};
