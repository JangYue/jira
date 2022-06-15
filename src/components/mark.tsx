// 让看板列 关键词高亮
import React from "react";
// 管理项目管理
// 管理
export const Mark = ({ name, keyword }: { name: string; keyword: string }) => {
  if (!keyword) {
    return <>{name}</>;
  }
  const arr = name.split(keyword);
  return (
    <>
      {arr.map((str: string, index: number) => (
        <span key={index}>
          {str}
          {index === arr.length - 1 ? null : (
            <span key={`${index},${keyword}`} style={{ color: "#257AFD" }}>
              {keyword}
            </span>
          )}
        </span>
      ))}
    </>
  );
};
