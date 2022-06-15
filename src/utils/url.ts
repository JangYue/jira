import { useCallback, useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject, useDebounce } from "utils";

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParam] = useSearchParams();
  return [
    // 只有当显示的调用setSearchParams时 才会认为searchParams发生了变化
    useMemo(
      () =>
        keys.reduce((prev: { [key in K]: K }, key: K) => {
          return { ...prev, [key]: searchParams.get(key) };
        }, {} as { [key in K]: K }),
      [searchParams]
    ),
    (param: Partial<{ [key in K]: unknown }>) => {
      // iterator
      // Object.fromEntries 把键值对转换为一个对象 给他传入的是iterable
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...param,
      }) as URLSearchParamsInit;
      return setSearchParam(o);
    },
  ] as const;
  // const a = ['12',1,()=>{}] as const
};

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    // iterator
    // Object.fromEntries 把键值对转换为一个对象 给他传入的是iterable
    if (params.name) {
    }
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
