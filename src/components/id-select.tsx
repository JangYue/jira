import { Select } from "antd";
import React from "react";
import { Raw } from "types/index";
type SelectProps = React.ComponentProps<typeof Select>;

interface IdSelectProps
  extends Omit<SelectProps, "value" | "onChange" | "options"> {
  value?: Raw | null | undefined;
  onChange?: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}
/**
 *
 * @param props
 * value 可以传入多种类型的值
 * onChange只会回调Number | undefined 类型
 * 当 isNaN(Number(value)) 为true时,代表选择默认类型
 * 当选择默认类型时,onChange会回调undefined
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      value={options?.length ? toNumber(value) : 0}
      // value={toNumber(value)}
      onChange={(value) => onChange?.(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : (
        "null"
      )}
      {options?.map((option) => (
        <Select.Option value={option.id} key={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};
// 将value转换为数组
const toNumber = (value: unknown) => {
  return isNaN(Number(value)) ? 0 : Number(value);
};
