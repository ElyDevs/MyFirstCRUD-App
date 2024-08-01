import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

const WinterMode = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDeleteMode = () => {
    onClose();
    localStorage.removeItem("mode");
    window.location.reload();
  };

  const getYear = () => {
    const today = new Date();
    return `${today.getFullYear()} - ${today.getFullYear() + 1}`;
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box flex="1" textAlign="center">
          <Text>Winter {getYear()}</Text>
        </Box>

        <IconButton
          size="s"
          isRound={true}
          colorScheme="red"
          icon={<HighlightOffRoundedIcon />}
          onClick={onOpen}
        />
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
              Delete Workspace
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteMode} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default WinterMode;
