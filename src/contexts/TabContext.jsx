import React, { createContext, useState } from "react";

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <TabContext.Provider value={{ tabIndex, setTabIndex }}>
      {children}
    </TabContext.Provider>
  );
};
