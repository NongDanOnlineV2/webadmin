// src/components/Redirect.jsx
import { useEffect } from "react";

const Redirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return null;
};

export default Redirect;
