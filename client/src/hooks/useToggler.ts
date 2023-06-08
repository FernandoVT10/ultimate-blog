import { useCallback, useState } from "react";

const useToggler = (initialState = false): [boolean, () => void] => {
  const [value, setValue] = useState(initialState);

  const toggleValue = useCallback(() => setValue(prev => !prev), []);

  return [value, toggleValue];
};

export default useToggler;
