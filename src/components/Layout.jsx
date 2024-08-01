import { Box } from "@chakra-ui/react";
import React from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";

const Layout = () => {
  return (
    <Box
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor={"#242424"}
    >
      <Box
        display={"flex"}
        border={"1px solid white"}
        borderRadius={"10px"}
        bgColor={"#242424"}
        w={"70%"}
        h={"70%"}
      >
        <Sidebar />
        <Content />
      </Box>
    </Box>
  );
};

export default Layout;
