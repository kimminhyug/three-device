import { useState, useEffect } from "react";

export const useKeyboardControl = () => {
  const keys = {
    w: "forward",
    s: "backward",
    a: "left",
    d: "right",
    Space: "jump",
  };

  const moveFieldByKey = (key) => keys[key];

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
    };
    const handleKeyUp = (e) => {
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return movement;
};
