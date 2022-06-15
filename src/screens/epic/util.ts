import { useProjectIdInUrl } from "screens/kanban/util";

// 特定kanban请求的id参数
export const useEpicsSearchParams = () => ({
  projectId: useProjectIdInUrl(),
});

// kanban在react-query中缓存的queryKey
export const useEpicsQueryKey = () => ["epics", useEpicsSearchParams()];
