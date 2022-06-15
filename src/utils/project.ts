import { useHttp } from "httpPackage";
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";
import { Project } from "types/project";

import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";

// 获取请求Projects的数据
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

// 将修改的数据传给服务器
export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey, "projects")
  );
  // const { run, ...asyncResult } = useAsync();
  // const client = useHttp();
  // const mutate = (params: Partial<Project>) => {
  //   return run(
  //     client(`projects/${params.id}`, {
  //       data: params,
  //       method: "PATCH",
  //     })
  //   );
  // };
  // return {
  //   mutate,
  //   ...asyncResult,
  // };
};

export const useAddProject = (queryKey: QueryKey) => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey, "projects")
  );
  // const mutate = (params: Partial<Project>) => {
  //   return run(
  //     client(`projects/${params.id}`, {
  //       data: params,
  //       method: "POST",
  //     })
  //   );
  // };
  // return {
  //   mutate,
  //   ...asyncResult,
  // };
};

export const useDeleteProject = (queryKey: QueryKey) => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey, "projects")
  );
};

// 根据传入的Id获取project详情
export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery(
    ["project", { id }],
    () => client(`projects/${id}`),
    // 当Id有值时才去触发useProject 才去获取数据存入缓存
    {
      enabled: !!id,
    }
  );
};
