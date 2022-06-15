import { Input, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useAddTasks } from "utils/kanban";
import { useProjectIdInUrl, useTasksQueryKey } from "./util";
export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const { mutateAsync: addTask } = useAddTasks(useTasksQueryKey());
  const projectId = useProjectIdInUrl();
  const [inputMoad, setInputMode] = useState(false);

  const submit = async () => {
    await addTask({ projectId, name, kanbanId });
    // 按下回车键 提交后 页面显示 +创建事务 同时把input输入框置空
    setInputMode(false);
    setName("");
  };

  const toggle = () => setInputMode((mode) => !mode);

  useEffect(() => {
    // 未点击时 input输入框为空
    if (!inputMoad) {
      setName("");
    }
  }, [inputMoad]);

  // 未点击时 显示创建事务
  if (!inputMoad) {
    return <div onClick={toggle}>+创建事务</div>;
  }

  // 点击时 显示input输入框
  return (
    <Card>
      {/* onBlur 在用户离开input框时触发  --- 失去焦点 */}
      <Input
        onBlur={toggle}
        placeholder={"需要做些什么"}
        autoFocus={true}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Card>
  );
};
