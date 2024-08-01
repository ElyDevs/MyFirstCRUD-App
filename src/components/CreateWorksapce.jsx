import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import SummerMode from "./SummerMode";
import WinterMode from "./WinterMode";
import { t } from "i18next";

const CreateWorksapce = () => {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    localStorage.setItem("mode", newMode);
    window.location.reload();
  };

  if (mode) {
    return mode === "summer" ? <SummerMode /> : <WinterMode />;
  }

  return (
    <Box
      h={"100%"}
      gap={"10px"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box>{t("No Workspace Yet!")}</Box>
      <Box>
        <Popover>
          <PopoverTrigger>
            <Button>{t("Create Workspace")}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader textAlign={"center"}>
              {t("Choose Mode!")}
            </PopoverHeader>
            <PopoverBody>
              <HStack justifyContent={"center"}>
                <Tooltip
                  hasArrow
                  label="One-time Payment For The Summer Tournament"
                  maxW="100%"
                >
                  <Button onClick={() => handleModeChange("summer")}>
                    {t("Summer Mode")}
                  </Button>
                </Tooltip>
                <Tooltip
                  hasArrow
                  label="Coming Soon!"
                  // label="Monthly Payments For Winter Activities"
                  maxW="100%"
                >
                  <Button onClick={() => handleModeChange("winter")} isDisabled>
                    {t("Winter Mode")}
                  </Button>
                </Tooltip>
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </Box>
  );
};

export default CreateWorksapce;
