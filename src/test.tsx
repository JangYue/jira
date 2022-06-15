import { useCallback, useEffect, useState } from "react";

export const Test = () => {
  const [state, setState] = useState({ name: "" });
  useEffect(() => {
    setState({ ...state });
  });

  return <div>123 {state.name}</div>;
};
