import React from "react";
import Layout from "./components/Layout";
import { StudentProvider } from "./contexts/StudentContext";
import { TabProvider } from "./contexts/TabContext";

function App() {
  return (
    <TabProvider>
      <StudentProvider>
        <Layout />
      </StudentProvider>
    </TabProvider>
  );
}

export default App;
