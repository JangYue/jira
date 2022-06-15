import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "utils/index";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "error" | "loading" | "success";
}

const defaultInitial: State<null> = {
  stat: "idle",
  error: null,
  data: null,
};

const defaultConfig = {
  throwOnError: false,
};

// 请求数据后的一些状态返回 正在请求 请求成功 失败 loading...
// 用useReducer改造

export const useAsync = <D>(
  initialStat?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };
  const [retry, setRetry] = useState(() => () => {});
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitial,
      ...initialStat,
    }
  );
  const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
    const mountedRef = useMountedRef();
    return useCallback(
      (...args: T[]) => {
        return mountedRef.current ? dispatch(...args) : void 0;
      },
      [dispatch, mountedRef]
    );
  };

  const safeDispatch = useSafeDispatch(dispatch);
  // const mountedRef = useMountedRef();

  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        stat: "success",
        error: null,
      }),
    [safeDispatch]
  );

  // const setData = useCallback( (data:D) =>dispatch({
  //     data,
  //     stat: 'success',
  //     error: null
  // }),[])
  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        stat: "error",
        data: null,
      }),
    [safeDispatch]
  );

  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      // 如果没有传入promise 或者 传入的不为promise
      if (!promise || !promise.then) {
        throw new Error("请传入 Promise 类型数据");
      }
      setRetry(() => () => {
        if (runConfig?.retry) run(runConfig?.retry(), runConfig);
      });
      // 这样会和callback产生无限循环 因为每一次state都发生了变化
      // setState({...state,stat:'loading'});
      // 正确用法如下: 不要使用到state 使用他的函数时编程
      // setState((preState)=> ({...preState,stat:'loading'}) )
      safeDispatch({ stat: "loading" });

      return promise
        .then((data) => {
          // 组件挂载时赋值 阻止卸载时赋值
          setData(data);
          return data;
        })
        .catch((error) => {
          // catch会消耗异常  要主动抛出错误
          setError(error);
          if (config.throwOnError) {
            return Promise.reject(error);
          }
          // return error;
        });
    },
    [config.throwOnError, setData, setError, safeDispatch]
  );
  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    //retry被调用时,让state刷新一遍,解决收藏组件点击后页面刷新问题
    retry,
    ...state,
  };
};
// useAsync = <D>(initialStat?:State<D>,initialConfig?:typeof defaultConfig) => {
//     const config = {...defaultConfig,...initialConfig}
//     const [retry,setRetry] = useState(()=>()=>{})
//     const [state,setState] = useState<State<D>>({
//         ...defaultInitial,
//         ...initialStat
//     })
//     const mountedRef = useMountedRef();
//     const setData = useCallback( (data:D) =>setState({
//         data,
//         stat: 'success',
//         error: null
//     }),[])
//     const setError = useCallback((error:Error) => setState({
//         error,
//         stat:'error',
//         data:null
//     }),[])
//     const run = useCallback((promise:Promise<D>,runConfig?:{retry:() => Promise<D>}) => {
//         // 如果没有传入promise 或者 传入的不为promise
//         if(!promise || !promise.then){
//             throw new Error('请传入 Promise 类型数据');
//         }
//         setRetry(()=>()=>{
//             if(runConfig?.retry)
//             run(runConfig?.retry(),runConfig)
//         })
//         // 这样会和callback产生无限循环 因为每一次state都发生了变化
//         // setState({...state,stat:'loading'});
//         // 正确用法如下: 不要使用到state 使用他的函数时编程
//         setState((preState)=> ({...preState,stat:'loading'}) )
//         return promise.then(data => {
//            // 组件挂载时赋值 阻止卸载时赋值
//             if(mountedRef.current){
//                 setData(data);
//             }
//             return data;

//         }).catch(error => {
//             // catch会消耗异常  要主动抛出错误
//             setError(error);
//             if(config.throwOnError){
//                 return Promise.reject(error)
//             }
//             // return error;

//         })
//     },[ config.throwOnError, mountedRef, setData,setError])
//     return {
//         isIdle: state.stat === 'idle',
//         isLoading: state.stat === 'loading',
//         isError: state.stat === 'error',
//         isSuccess: state.stat === 'success',
//         run,
//         setData,
//         setError,
//         //retry被调用时,让state刷新一遍,解决收藏组件点击后页面刷新问题
//         retry,
//         ...state
//     }
// }
