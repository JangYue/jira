import React, { ReactElement, ReactNode } from "react";
type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  // export class ErrorBoundary extends React.Component<{ children: any, fallbackRender:FallbackRender },{error:Error | null}>{
  state = { error: null };
  // 当子组件抛出异常，这里会接收到并且调用
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    // React.Element === JSX.Element
    // ReactElement and JSX Element and ReactComponent is ReactNode's subSet.
    // 前者都有 key props type
    // 后者 boolean string object
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return <>{children}</>;
  }
}
