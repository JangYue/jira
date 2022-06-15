import { useHttp } from "httpPackage";
import { Kanban } from "types/kanban";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";
import { QueryKey } from "react-query";

import { Epic } from "types/epic";

// 获取看板列表
export const useEpics = (param?: Partial<Kanban>) => {
  const client = useHttp();
  return useQuery<Epic[]>(["epics", param], () =>
    client("epics", { data: param })
  );
};
export const useAddEpics = (queryKey: QueryKey) => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  return useMutation(
    (params: Partial<Epic>) =>
      client(`epics`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey, "epics")
  );
};

export const useDeleteEpics = (queryKey: QueryKey) => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`epics/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey, "epics")
  );
};
