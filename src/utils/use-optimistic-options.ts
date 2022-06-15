import { QueryKey, useQueryClient } from "react-query";

export const useConfig = (
  queryKey: QueryKey,
  name: string,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(name),
    // 乐观更新
    async onMutate(target: any) {
      const previousItem = queryClient.getQueryData(queryKey);
      //@ts-ignore
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return { previousItem };
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context?.previousItem);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey, name: string) =>
  useConfig(
    queryKey,
    name,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );
export const useEditConfig = (queryKey: QueryKey, name: string) =>
  useConfig(
    queryKey,
    name,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );
export const useAddConfig = (queryKey: QueryKey, name: string) => {
  return useConfig(queryKey, name, (target, old = []) => {
    if (target.length) {
      return [...old, ...target];
    } else {
      return [];
    }
  });
};

// 拖拽持久化乐观更新配置
export const useTaskReorderConfig = (querykey: QueryKey, name: string) =>
  useConfig(querykey, name, (target, old = []) => old || []);
export const useKanbanReorderConfig = (querykey: QueryKey, name: string) =>
  useConfig(querykey, name, (target, old = []) => old || []);
