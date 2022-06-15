import { useHttp } from "httpPackage";
import { useQuery } from "react-query";
import { User } from "types/user";
import { cleanObject } from "utils";

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();
  return useQuery<User[]>([], () =>
    client("users", { data: cleanObject(param || {}) })
  );
};
