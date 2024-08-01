import React, { useContext } from "react";
import {
  Box,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Home from "./Home";
import AddStudent from "./AddStudent";
import Student from "./Student";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import { TabContext } from "../contexts/TabContext";
import Settings from "./Settings";

const Content = () => {
  const { tabIndex, setTabIndex } = useContext(TabContext);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  const handleSettingsClick = () => {
    setTabIndex(3);
  };

  return (
    <Box
      overflow={"auto"}
      h={"100%"}
      flex={2}
      p={"10px"}
      sx={{
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#333",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#555",
          borderRadius: "24px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#777",
        },
      }}
    >
      <Tabs
        isFitted
        variant="enclosed"
        index={tabIndex}
        onChange={handleTabChange}
        h={"100%"}
      >
        <TabList>
          <Tab>
            <HomeRoundedIcon />
          </Tab>
          <Tab>
            <PersonAddAltRoundedIcon />
          </Tab>
          <Tab>
            <PeopleAltRoundedIcon />
          </Tab>
          <Box pl={2}>
            <IconButton
              bg={tabIndex === 3 ? "#474747" : "transparent"}
              onClick={handleSettingsClick}
              icon={<SettingsApplicationsRoundedIcon />}
            />
          </Box>
        </TabList>
        <TabPanels h={"90%"}>
          <TabPanel h={"100%"}>
            <Box h={"100%"}>
              <Home />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <AddStudent />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Student />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Settings />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Content;
