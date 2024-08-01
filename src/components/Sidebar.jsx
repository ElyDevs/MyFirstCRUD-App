import React, { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import Logo from "./Logo";
import Search from "./Search";
import Students from "./Students";

const Sidebar = () => {
  const [hasResults, setHasResults] = useState(false);
  const [showStudents, setShowStudents] = useState(true);
  const [isWorkspaceVisible, setIsWorkspaceVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  return (
    <Box flex={1} borderRight={"1px solid white"}>
      <VStack h={"100%"} spacing={0}>
        <Box
          flex={"0 0 18%"}
          borderBottom={"1px solid white"}
          borderRadius={"10px"}
          w={"100%"}
        >
          <Logo />
        </Box>

        <Box
          flex={hasResults ? "0 0 80%" : "0 0 15%"}
          w={"100%"}
          overflowY={hasResults ? "scroll" : "hidden"}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray.500",
              borderRadius: "10px",
            },
          }}
        >
          <Box>
            <Search
              setHasResults={setHasResults}
              setShowStudents={setShowStudents}
              isHistoryVisible={isHistoryVisible}
              isWorkspaceVisible={isWorkspaceVisible}
            />
          </Box>
        </Box>

        <Box
          flex={hasResults ? "0 0 0" : "1 1 auto"}
          w={"100%"}
          overflowY="auto"
          borderTop={"1px solid white"}
          borderRadius={"10px"}
        >
          {showStudents && isHistoryVisible && <Students />}
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
