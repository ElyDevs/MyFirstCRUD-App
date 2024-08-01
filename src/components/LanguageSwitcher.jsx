import { Box, Button, HStack } from "@chakra-ui/react";
import { t } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
    window.location.reload();
  };

  return (
    <Box
      w={"full"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <HStack>
        <Button
          rounded={"full"}
          colorScheme="blue"
          onClick={() => switchLanguage("en")}
        >
          {t("English")}
        </Button>
        <Button
          rounded={"full"}
          colorScheme="blue"
          onClick={() => switchLanguage("ar")}
        >
          {t("Arabic")}
        </Button>
      </HStack>
    </Box>
  );
};

export default LanguageSwitcher;
