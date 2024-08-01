import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Collapse,
  IconButton,
  Link,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LanguageSwitcher from "./LanguageSwitcher";
import { t } from "i18next";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const Settings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);
  const [deleteDate, setDeleteDate] = useState(null);
  const [isLanguageBoxOpen, setIsLanguageBoxOpen] = useState(false);

  useEffect(() => {
    const creationDate = localStorage.getItem("creationDate");
    if (creationDate) {
      const creationDateObj = new Date(creationDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - creationDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 30) {
        setIsDeleteDisabled(false);
      } else {
        const deletionDateObj = new Date(creationDateObj);
        deletionDateObj.setDate(deletionDateObj.getDate() + 30);
        setDeleteDate(deletionDateObj.toDateString());
      }
    } else {
      localStorage.setItem("creationDate", new Date().toISOString());
    }
  }, []);

  const handleDeleteMode = () => {
    onClose();
    localStorage.removeItem("workspace");
    localStorage.removeItem("mode");
    localStorage.removeItem("creationDate");
    window.location.reload();
  };

  const handleLanguageToggle = () => {
    setIsLanguageBoxOpen((prev) => !prev);
  };

  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <Box w={"50%"}>
        <Center
          flex="1"
          textAlign="center"
          transition="transform 0.3s ease"
          _hover={{ transform: "scale(1.1)" }}
          userSelect={"none"}
        >
          <Text py={2.5} px={2.5 * 10} fontSize="xl" as="samp">
            {t("Settings")}
          </Text>
        </Center>
        <Stack>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={2.5}
            border={"1px solid white"}
            rounded={"full"}
          >
            <Text as="samp">{t("Delete Workspace")}</Text>
            <Tooltip
              hasArrow
              label={
                isDeleteDisabled ? (
                  <Box>
                    {t("Delete on")} <br />
                    <Text as="span" fontWeight="bold">
                      {deleteDate}
                    </Text>
                  </Box>
                ) : (
                  "Delete Workspace"
                )
              }
              bg={"tomato"}
              placement="right"
            >
              <IconButton
                isRound
                colorScheme="red"
                icon={<HighlightOffRoundedIcon />}
                onClick={onOpen}
                isDisabled={isDeleteDisabled}
              />
            </Tooltip>
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={2.5}
            border={"1px solid white"}
            rounded={"full"}
          >
            <Text as="samp">{t("Change Language")}</Text>

            <IconButton
              isRound
              colorScheme="orange"
              icon={<TranslateRoundedIcon />}
              onClick={handleLanguageToggle}
            />
          </Box>

          <Collapse in={isLanguageBoxOpen}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              p={2.5}
              border="1px solid white"
              rounded="full"
            >
              <Box flex="1">
                <LanguageSwitcher />
              </Box>
              <Box position="absolute" right={2} top={2}>
                <IconButton
                  isRound
                  colorScheme="yellow"
                  icon={<CloseRoundedIcon />}
                  onClick={handleLanguageToggle}
                />
              </Box>
            </Box>
          </Collapse>
        </Stack>
        <Center my={5}>
          <Text fontSize={"lg"}>
            {t("Developed By")}{" "}
            <Link href="https://github.com/ElyDevs" color="blue.300" isExternal>
              ElyMoo
            </Link>
          </Text>
        </Center>
      </Box>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("Delete Workspace")}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t("Are you sure? You can't undo this action afterwards.")}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("Cancel")}
              </Button>
              <Button colorScheme="red" onClick={handleDeleteMode} ml={3}>
                {t("Delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Settings;
