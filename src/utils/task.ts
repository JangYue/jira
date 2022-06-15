import { useHttp } from "httpPackage";
import { useQuery } from "react-query";
import { Task } from "types/task";
import { QueryKey } from "react-query";
import { useMutation } from "react-query";
import {
  useEditConfig,
  useDeleteConfig,
  useTaskReorderConfig,
} from "./use-optimistic-options";
import { SortProps } from "./kanban";

// 获取task列表
export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();
  // 2秒中内 如果有相同的请求发送 会把他们cache起来 只发送其中一个
  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
  );
};

// 根据传入的Id获取task详情
export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery(
    ["tasks", { id }],
    () => client(`tasks/${id}`),
    // 当Id有值时才去触发useProject 才去获取数据存入缓存
    {
      enabled: !!id,
    }
  );
};

// 将修改的数据传给服务器
export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey, "tasks")
  );
};

export const useDeleteTasks = (queryKey: QueryKey) => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`tasks/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey, "tasks")
  );
};

// 拖拽 持久化
export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((param: SortProps) => {
    return client("tasks/reorder", {
      data: param,
      method: "POST",
    });
  }, useTaskReorderConfig(queryKey, "tasks"));
};
