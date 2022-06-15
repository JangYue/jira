import { useEffect, useState, useRef } from "react";

// 检测属性值是否等于0
export const isFalsy = (value: any) => (value === 0 ? false : !value);

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

// 清除空的对象属性
export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};

// 防抖
export const useDebounce = <V>(value: V, delay?: number): V => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // 每次在value和delay变化时,设置一个定时器
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完以后再运行 做清理工作
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};

// 自定义组件标题

// @param keepOnUnmount : 页面卸载时是否保存标题
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  // 返回的ref对象,在整个组件的生命周期内都保持不变
  const old_title = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        // 如果不指定依赖读的就是旧title
        document.title = old_title;
      }
    };
  }, [keepOnUnmount, old_title]);
};

// 重置路由
export const resetRoute = () => (window.location.href = window.location.origin);

// 返回组件的挂载状态 挂载返回true 卸载返回false
// 功能: 当数据还未返回时,此时退出登录 可能会导致错误(已经退出了 但是promise再退出后返回,返回后设置数据给组件,但此时组件已经卸载了)
// 通过该功能来判断 此时组件是挂载是卸载状态

export const useMountedRef = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};
