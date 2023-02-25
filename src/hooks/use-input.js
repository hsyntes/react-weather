import { useReducer } from "react";

const initialState = {
  input: "",
};

const reducer = (state, action) => {
  const { payload } = action;

  return {
    ...state,
    input: payload,
  };
};

const useInput = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOnChange = (e) => dispatch({ payload: e.target.value });

  return {
    state,
    handleOnChange,
  };
};

export default useInput;
