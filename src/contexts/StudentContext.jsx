import React, { createContext, useState } from "react";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  return (
    <StudentContext.Provider
      value={{ selectedStudentId, setSelectedStudentId }}
    >
      {children}
    </StudentContext.Provider>
  );
};
