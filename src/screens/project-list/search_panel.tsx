/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Input, Select, Form } from "antd";
import { Project } from "types/project";
import { UserSelect } from "components/user-select";
import { User } from "types/user";
interface SearchPanel {
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: SearchPanel["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanel) => {
  return (
    <Form
      css={css`
        margin-bottom: "2rem";
      `}
      layout={"inline"}
    >
      <Form.Item>
        <Input
          type="text"
          value={param.name}
          placeholder={"项目名"}
          onChange={(evt) =>
            setParam({
              ...param,
              name: evt.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          value={param.personId}
          defaultOptionName={"负责人"}
          /* ts-ignore */
          onChange={(value: number | undefined) =>
            setParam({
              ...param,
              personId: value,
            })
          }
        ></UserSelect>
      </Form.Item>
    </Form>
  );
};
