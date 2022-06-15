import { useHttp } from "httpPackage";
import { Kanban } from "types/kanban";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import {
  useAddConfig,
  useDeleteConfig,
  useKanbanReorderConfig,
} from "./use-optimistic-options";
import { QueryKey } from "react-query";
import { Task } from "types/task";

// 获取看板列表
export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};
export const useAddKanban = (queryKey: QueryKey) => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey, "kanbans")
  );
};
export const useAddTasks = (queryKey: QueryKey) => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey, "tasks")
  );
};

export const useDeleteKanban = (queryKey: QueryKey) => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey, "kanbans")
  );
};

export interface SortProps {
  // 要重新排序的item
  fromId?: number;
  // 目标Item
  referenceId?: number;
  // 要放在目标Item的前还是后
  type: "before" | "after";
  fromKanbanId?: number;
  toKanbanId?: number;
}

// 拖拽 持久化
export const useReorderKanban = (querykey: QueryKey) => {
  const client = useHttp();
  return useMutation((param: SortProps) => {
    return client("kanbans/reorder", {
      data: param,
      method: "POST",
    });
  }, useKanbanReorderConfig(querykey, "kanbans"));
};
