import { Box, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Statistiques from "./Statistiques";
import Workspace from "./Workspace";
import Search from "./Search";
import { t } from "i18next";
import Expenses from "./Expenses";

const SummerMode = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const [hasResults, setHasResults] = useState(false);
  const [showStudents, setShowStudents] = useState(true);
  const [isWorkspaceVisible, setIsWorkspaceVisible] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const getYear = () => {
    const today = new Date();
    return today.getFullYear();
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    window.location.reload();
  };

  return (
    <Box>
      <Stack spacing={4}>
        <Box display="flex" alignItems="center" position="relative">
          <Box
            flex="1"
            textAlign="center"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.1)" }}
            userSelect={"none"}
          >
            <Text
              bg="teal"
              rounded="full"
              py={2.5}
              px={2.5 * 10}
              fontSize="xl"
              as="samp"
            >
              {t("Summer")} {getYear()}
            </Text>
          </Box>

          <HStack position="absolute" right={0}>
            <IconButton
              isRound
              colorScheme="blue"
              icon={<RefreshRoundedIcon />}
              onClick={handleRefresh}
            />
          </HStack>
        </Box>
        <Box>
          <Statistiques key={refreshKey} />
        </Box>
        {/* <Box><Expenses /></Box> */}

        {/* Search & Result */}
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
          {showStudents && isWorkspaceVisible && !isHistoryVisible && (
            <Workspace />
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default SummerMode;
