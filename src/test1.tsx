import { useState, useRef, useCallback, useEffect } from "react";
import React from "react";
import styled from "@emotion/styled";
const Child = (props: any) => {
  console.log("渲染了子组件");
  const { onClick } = props;
  return <button onClick={onClick}>点击按钮获取值</button>;
};

const ChildMemo = React.memo(Child);

export const Parent = () => {
  // const [text, updateText] = useState('');
  // const textRef = useRef(text);
  // const handleSubmit = useCallback(() => {
  //   console.log('当前输入框的值:', textRef.current);
  // }, [textRef])
  // useEffect(()=>{
  //   textRef.current = text;
  // },[text])
  // return(
  //   <div>
  //     我是父组件
  //     <input type="text" value={text} onChange={(e) => updateText(e.target.value)}/>
  //     <ChildMemo onClick={handleSubmit}/>
  //   </div>
  // )
  return <Container />;
};

const Container = styled.div`
  position: absolute;
  width: 0px;
  height: 0px;
  content: " ";
  border-right: 100px solid transparent;
  border-top: 100px solid #ff0;
  border-left: 100px solid transparent;
  border-bottom: 100px solid transparent;
`;
