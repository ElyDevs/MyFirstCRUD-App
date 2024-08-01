import {
  Box,
  Button,
  Collapse,
  HStack,
  IconButton,
  Input,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  InputRightAddon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { StudentContext } from "../contexts/StudentContext";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import { t } from "i18next";

const Student = () => {
  const { selectedStudentId } = useContext(StudentContext);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [originalValue, setOriginalValue] = useState(""); // Track the original value
  const [isModePresent, setIsModePresent] = useState(false); // State to track if "mode" is present in localStorage
  const [isInWorkspace, setIsInWorkspace] = useState(false);
  const [feePaidAmount, setFeePaidAmount] = useState("");
  const [bookPaidAmount, setBookPaidAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false); // State for AlertDialog
  const [cancelRef, setCancelRef] = useState(null); // Ref for the cancel button
  const placeholderText = t("Enter Subscription Fee Amount Paid / 40 DT");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to fetch student data from localStorage
  const fetchStudentData = () => {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students.find(
      (student) => student.student.id === selectedStudentId
    );
    setSelectedStudent(student ? student : null);
    onClose(); // Close edit fields when the student changes
  };

  useEffect(() => {
    fetchStudentData();
  }, [selectedStudentId]);

  useEffect(() => {
    if (selectedStudent) {
      const workspace = JSON.parse(localStorage.getItem("workspace")) || [];
      const studentInWorkspace = workspace.some(
        (student) => student.student.id === selectedStudentId
      );
      setIsInWorkspace(studentInWorkspace);
    }
  }, [selectedStudent, selectedStudentId]);

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    setIsModePresent(!!mode);
  }, []);

  useEffect(() => {
    // Retrieve the workspace from localStorage
    const workspace = JSON.parse(localStorage.getItem("workspace")) || [];

    // Find the student with the selected ID
    const student = workspace.find(
      (stu) => stu.student.id === selectedStudentId
    );

    // Set the selectedStudent state
    if (student) {
      setSelectedStudent(student);
      setFeePaidAmount(student.student.feePaidAmount); // Ensure this is set correctly
      setBookPaidAmount(student.student.bookPaidAmount); // Ensure this is set correctly
    }
  }, [selectedStudentId]);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    return phoneNumber
      .replace(/\D/g, "") // Remove non-digit characters
      .slice(0, 8) // Limit to 8 digits
      .replace(/(\d{2})(\d{3})?(\d{3})?/, "$1 $2 $3")
      .trim();
  };

  const formatCIN = (cin) => {
    if (!cin) return "";
    return cin
      .replace(/\D/g, "") // Remove non-digit characters
      .slice(0, 8) // Limit to 8 digits
      .replace(/(\d{3})(\d{3})?(\d{2})?/, "$1 $2 $3")
      .trim();
  };

  const handleEdit = (field, value) => {
    if (editField === field) {
      setEditField(null);
      setEditValue("");
      setOriginalValue("");
      onClose();
    } else {
      setEditField(field);
      setOriginalValue(value);
      setEditValue(value);
      onOpen();
    }
  };

  const handleSave = () => {
    const updatedValue = parseFloat(editValue); // Ensure the value is numeric

    const updatedStudent = { ...selectedStudent };

    if (editField.startsWith("student")) {
      if (
        editField === "student.feePaidAmount" ||
        editField === "student.bookPaidAmount"
      ) {
        updatedStudent.student[editField.split(".")[1]] = updatedValue; // Update numeric fields
      } else {
        updatedStudent.student[editField.split(".")[1]] =
          capitalizeWords(editValue);
      }
    } else {
      if (editField === "parent.phoneNumber") {
        updatedStudent.parent.phoneNumber = editValue.replace(/\s+/g, "");
      } else if (editField === "parent.cin") {
        updatedStudent.parent.cin = editValue.replace(/\s+/g, "");
      } else {
        updatedStudent.parent[editField.split(".")[1]] =
          capitalizeWords(editValue);
      }
    }

    setSelectedStudent(updatedStudent);

    // Update the students in local storage
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const updatedStudents = students.map((student) =>
      student.student.id === selectedStudentId ? updatedStudent : student
    );
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    // Update the workspace in local storage
    const existingWorkspace =
      JSON.parse(localStorage.getItem("workspace")) || [];
    const updatedWorkspace = existingWorkspace.map((student) =>
      student.student.id === selectedStudentId ? updatedStudent : student
    );
    localStorage.setItem("workspace", JSON.stringify(updatedWorkspace));

    toast({
      title: "Success",
      description: "Student information updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setEditField(null);
    setEditValue("");
    setOriginalValue(""); // Reset the original value
    onClose(); // Close the edit field after saving
  };

  const handleCancel = () => {
    setEditField(null);
    setEditValue("");
    setOriginalValue(""); // Reset the original value
    onClose(); // Close the edit field when canceling
  };

  const handlePhoneNumberChange = (e) => {
    const rawValue = e.target.value.replace(/\s+/g, ""); // Remove spaces from the input
    const formattedValue = formatPhoneNumber(rawValue);
    setEditValue(formattedValue);
  };

  const handleCinChange = (e) => {
    const rawValue = e.target.value.replace(/\s+/g, ""); // Remove spaces from the input
    const formattedValue = formatCIN(rawValue);
    setEditValue(formattedValue);
  };

  // Check if the current value differs from the original value
  const isSaveButtonEnabled = editValue !== originalValue;

  const addToWorkspace = () => {
    const feeAmount = parseInt(feePaidAmount, 10);
    const bookAmount = parseInt(bookPaidAmount, 10);

    if (
      isNaN(feeAmount) ||
      feeAmount < 0 ||
      feeAmount > 40 ||
      isNaN(bookAmount) ||
      bookAmount < 0 ||
      bookAmount > 5
    ) {
      toast({
        title: "Invalid Amounts",
        description:
          "Please enter valid amounts between 0 and 40 for fee and between 0 and 5 for books.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const existingWorkspace =
      JSON.parse(localStorage.getItem("workspace")) || [];
    const studentInWorkspace = existingWorkspace.some(
      (student) => student.student.id === selectedStudentId
    );

    if (studentInWorkspace) {
      toast({
        title: "Already in WorkSpace",
        description: "This student is already in the workspace.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Add fee and book payment amounts to the student object
    const updatedStudent = {
      ...selectedStudent,
      student: {
        ...selectedStudent.student,
        feePaidAmount: feeAmount, // Store as a number
        bookPaidAmount: bookAmount, // Store as a number
      },
    };

    const updatedWorkspace = [...existingWorkspace, updatedStudent];
    localStorage.setItem("workspace", JSON.stringify(updatedWorkspace));

    // Update the state to reflect that the student is now in the workspace
    setIsInWorkspace(true);
    setSelectedStudent(updatedStudent); // Ensure the UI reflects the updated student
    setIsModalOpen(false);
    setFeePaidAmount("");
    setBookPaidAmount("");

    toast({
      title: "Added to WorkSpace",
      description: "Student information has been added to the workspace.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddToWorkspaceClick = () => {
    if (isModePresent && !isInWorkspace) {
      setFeePaidAmount("");
      setBookPaidAmount("0");
      setIsModalOpen(true);
    }
  };

  const handleRemoveFromWorkspace = () => {
    const existingWorkspace =
      JSON.parse(localStorage.getItem("workspace")) || [];
    const updatedWorkspace = existingWorkspace.filter(
      (student) => student.student.id !== selectedStudentId
    );

    localStorage.setItem("workspace", JSON.stringify(updatedWorkspace));

    // Update state
    setIsInWorkspace(false);

    toast({
      title: "Removed from WorkSpace",
      description: "Student has been removed from the workspace.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRemoveClick = () => {
    setAlertDialogIsOpen(true);
  };

  const handleAlertDialogClose = () => {
    setAlertDialogIsOpen(false);
  };

  const handleConfirmRemove = () => {
    handleRemoveFromWorkspace();
    handleAlertDialogClose();
  };

  return (
    <Box>
      <AlertDialog
        isOpen={alertDialogIsOpen}
        onClose={handleAlertDialogClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{t("Confirm Removal")}</AlertDialogHeader>
            <AlertDialogBody>
              {t(
                "Are you sure you want to remove this student from the workspace?"
              )}
              {t("This action cannot be undone.")}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleAlertDialogClose}>
                {t("Cancel")}
              </Button>
              <Button colorScheme="red" onClick={handleConfirmRemove} ml={3}>
                {t("Remove")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Add Student To Workspace")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Stack>
                <Box>
                  <Text>
                    <Text as={"b"}>{t("Subscription")}</Text>{" "}
                    {t("Fee Paid Amount")}
                  </Text>
                </Box>

                <InputGroup>
                  <InputLeftElement>
                    <AttachMoneyRoundedIcon />
                  </InputLeftElement>
                  <Input
                    type="number"
                    placeholder={placeholderText}
                    value={feePaidAmount}
                    onChange={(e) => setFeePaidAmount(e.target.value)}
                    max={40}
                    min={0}
                  />
                  <InputRightAddon>
                    <Text fontWeight={"bold"}>DT</Text>
                  </InputRightAddon>
                </InputGroup>
              </Stack>

              <Stack>
                <Box>
                  <Text>
                    <Text as={"b"}>{t("The Book")}</Text>{" "}
                    {t("Fee Paid Amount")}
                  </Text>
                </Box>

                <InputGroup>
                  <InputLeftElement>
                    <AutoStoriesRoundedIcon />
                  </InputLeftElement>
                  <Input
                    type="number"
                    placeholder="Enter Book Fee Amount Paid / 5 DT"
                    value={bookPaidAmount}
                    onChange={(e) => setBookPaidAmount(e.target.value)}
                    max={5}
                    min={0}
                  />
                  <InputRightAddon>
                    <Text fontWeight={"bold"}>DT</Text>
                  </InputRightAddon>
                </InputGroup>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={addToWorkspace}>
              {t("Add To Workspace")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              ml={3}
            >
              {t("Cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedStudent ? (
        <TableContainer border={"1px solid white"} borderRadius={"10px"}>
          <Table size={"sm"}>
            <TableCaption m={0}>
              <HStack>
                {isInWorkspace ? (
                  <Box>
                    <Button
                      onClick={handleRemoveClick}
                      colorScheme="red"
                      isDisabled={!isModePresent || !isInWorkspace}
                    >
                      {t("Remove From WorkSpace")}
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Button
                      onClick={handleAddToWorkspaceClick}
                      colorScheme="green"
                      isDisabled={!isModePresent || isInWorkspace}
                    >
                      {t("Add To Workspace")}
                    </Button>
                  </Box>
                )}
              </HStack>
            </TableCaption>
            <Thead>
              <Tr>
                <Th colSpan={3} textAlign={"center"}>
                  {t("Student's Info")}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr bg={"#2C5282"}>
                <Td>{t("Full Name")}</Td>
                <Td fontWeight={"bold"}>{selectedStudent.student.fullName}</Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() =>
                      handleEdit(
                        "student.fullName",
                        selectedStudent.student.fullName
                      )
                    }
                  >
                    {t("Modify")}
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={3}
                  py={isOpen && editField === "student.fullName" ? 2 : 0}
                  transition="padding 0.3s ease"
                >
                  <Collapse in={isOpen && editField === "student.fullName"}>
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"10px"}
                      >
                        <Box w={"50%"}>
                          <Input
                            size={"sm"}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={handleSave}
                            isDisabled={!isSaveButtonEnabled}
                          >
                            {t("Save")}
                          </IconButton>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Td>
              </Tr>
              <Tr bg={"#2C5282"}>
                <Td>{t("Date Of Birth")}</Td>
                <Td fontWeight={"bold"}>
                  <Box>
                    {selectedStudent.student.birthday} (
                    {calculateAge(selectedStudent.student.birthday)}{" "}
                    {t("Years Old")})
                  </Box>
                </Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() =>
                      handleEdit(
                        "student.birthday",
                        selectedStudent.student.birthday
                      )
                    }
                  >
                    {t("Modify")}
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={3}
                  py={isOpen && editField === "student.birthday" ? 2 : 0}
                  transition="padding 0.3s ease"
                >
                  <Collapse in={isOpen && editField === "student.birthday"}>
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"10px"}
                      >
                        <Box w={"50%"}>
                          <Input
                            size={"sm"}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            type="date"
                          />
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={handleSave}
                            isDisabled={!isSaveButtonEnabled}
                          >
                            {t("Save")}
                          </IconButton>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Td>
              </Tr>
              <Tr bg={"#2C5282"}>
                <Td>{t("Gender")}</Td>
                <Td fontWeight={"bold"}>{selectedStudent.student.gender}</Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() =>
                      handleEdit(
                        "student.gender",
                        selectedStudent.student.gender
                      )
                    }
                  >
                    {t("Modify")}
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={3}
                  py={isOpen && editField === "student.gender" ? 2 : 0}
                  transition="padding 0.3s ease"
                >
                  <Collapse in={isOpen && editField === "student.gender"}>
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"10px"}
                      >
                        <Box w={"50%"}>
                          <Select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          >
                            <option value="Boy">{t("Boy")}</option>
                            <option value="Girl">{t("Girl")}</option>
                          </Select>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={handleSave}
                            isDisabled={!isSaveButtonEnabled}
                          >
                            {t("Save")}
                          </IconButton>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Td>
              </Tr>
              <Tr bg={"#2C5282"}>
                <Td>{t("Class Year")}</Td>
                <Td fontWeight={"bold"}>{selectedStudent.student.classYear}</Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() =>
                      handleEdit(
                        "student.classYear",
                        selectedStudent.student.classYear
                      )
                    }
                  >
                    {t("Modify")}
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={3}
                  py={isOpen && editField === "student.classYear" ? 2 : 0}
                  transition="padding 0.3s ease"
                >
                  <Collapse in={isOpen && editField === "student.classYear"}>
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"10px"}
                      >
                        <Box w={"50%"}>
                          <Select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          >
                            <option value="1ere Primaire">
                              {t("1ere Année Primaire")}
                            </option>
                            <option value="2eme Primaire">
                              {t("2eme Année Primaire")}
                            </option>
                            <option value="3eme Primaire">
                              {t("3eme Année Primaire")}
                            </option>
                            <option value="4eme Primaire">
                              {t("4eme Année Primaire")}
                            </option>
                            <option value="5eme Primaire">
                              {t("5eme Année Primaire")}
                            </option>
                            <option value="6eme Primaire">
                              {t("6eme Année Primaire")}
                            </option>
                            <option value="7eme De Base">
                              {t("7eme Année De Base")}
                            </option>
                            <option value="8eme De Base">
                              {t("8eme Année De Base")}
                            </option>
                            <option value="9eme De Base">
                              {t("9eme Année De Base")}
                            </option>
                            <option value="1ere Secondaire">
                              {t("1ere Année Secondaire")}
                            </option>
                            <option value="2eme Secondaire">
                              {t("2eme Année Secondaire")}
                            </option>
                            <option value="3eme Secondaire">
                              {t("3eme Année Secondaire")}
                            </option>
                            <option value="4eme Secondaire">
                              {t("4eme Année Secondaire")}
                            </option>
                            <option value="Faculté">{t("Faculté")}</option>
                            <option value="Autre">{t("Autre")}</option>
                          </Select>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={handleSave}
                            isDisabled={!isSaveButtonEnabled}
                          >
                            {t("Save")}
                          </IconButton>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Td>
              </Tr>
              <Tr>
                <Th colSpan={3} textAlign={"center"}>
                  {t("Parent's Info")}
                </Th>
              </Tr>
              <Tr bg={"#2C5282"}>
                <Td>{t("Parent Full Name")}</Td>
                <Td fontWeight={"bold"}>{selectedStudent.parent.fullName}</Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() =>
                      handleEdit(
                        "parent.fullName",
                        selectedStudent.parent.fullName
                      )
                    }
                  >
                    {t("Modify")}
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={3}
                  py={isOpen && editField === "parent.fullName" ? 2 : 0}
                  transition="padding 0.3s ease"
                >
                  <Collapse in={isOpen && editField === "parent.fullName"}>
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"10px"}
                      >
                        <Box w={"50%"}>
                          <Input
                            size={"sm"}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={handleSave}
                            isDisabled={!isSaveButtonEnabled}
                          >
                            {t("Save")}
                          </IconButton>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Td>
              </Tr>
              <Tr bg={"#2C5282"}>
                <Td>{t("Parent Phone Number")}</Td>
                <Td fontWeight={"bold"}>
                  {formatPhoneNumber(selectedStudent.parent.phoneNumber)}
                </Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() =>
                      handleEdit(
                        "parent.phoneNumber",
                        selectedStudent.parent.phoneNumber
                      )
                    }
                  >
                    {t("Modify")}
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={3}
                  py={isOpen && editField === "parent.phoneNumber" ? 2 : 0}
                  transition="padding 0.3s ease"
                >
                  <Collapse in={isOpen && editField === "parent.phoneNumber"}>
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"10px"}
                      >
                        <Box w={"50%"}>
                          <Input
                            size={"sm"}
                            value={editValue}
                            onChange={handlePhoneNumberChange}
                            type="text" // Change type to text for custom formatting
                            maxLength={12} // Allow for formatting characters (e.g., spaces)
                          />
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={handleSave}
                            isDisabled={!isSaveButtonEnabled}
                          >
                            {t("Save")}
                          </IconButton>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Td>
              </Tr>
              <Tr bg={"#2C5282"}>
                <Td>{t("Parent CIN")}</Td>
                <Td fontWeight={"bold"}>
                  {formatCIN(selectedStudent.parent.cin)}
                </Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() =>
                      handleEdit("parent.cin", selectedStudent.parent.cin)
                    }
                  >
                    {t("Modify")}
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={3}
                  py={isOpen && editField === "parent.cin" ? 2 : 0}
                  transition="padding 0.3s ease"
                >
                  <Collapse in={isOpen && editField === "parent.cin"}>
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"10px"}
                      >
                        <Box w={"50%"}>
                          <Input
                            size={"sm"}
                            value={editValue}
                            onChange={handleCinChange}
                            type="text" // Change type to text for custom formatting
                            maxLength={12} // Allow for formatting characters (e.g., spaces)
                          />
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={handleSave}
                            isDisabled={!isSaveButtonEnabled}
                          >
                            {t("Save")}
                          </IconButton>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Td>
              </Tr>
              <Tr bg={"#2C5282"}>
                <Td>{t("Parent Occupation")}</Td>
                <Td fontWeight={"bold"}>{selectedStudent.parent.occupation}</Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() =>
                      handleEdit(
                        "parent.occupation",
                        selectedStudent.parent.occupation
                      )
                    }
                  >
                    {t("Modify")}
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={3}
                  py={isOpen && editField === "parent.occupation" ? 2 : 0}
                  transition="padding 0.3s ease"
                >
                  <Collapse in={isOpen && editField === "parent.occupation"}>
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"10px"}
                      >
                        <Box w={"50%"}>
                          <Input
                            size={"sm"}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={handleSave}
                            isDisabled={!isSaveButtonEnabled}
                          >
                            {t("Save")}
                          </IconButton>
                        </Box>
                        <Box>
                          <IconButton
                            size={"sm"}
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Td>
              </Tr>

              {isInWorkspace && selectedStudent && (
                <>
                  <Tr>
                    <Th colSpan={3} textAlign={"center"}>
                      {t("Payment's Info")}
                    </Th>
                  </Tr>

                  <Tr bg={"Teal"}>
                    <Td>{t("Subscription Fee Paid Amount")}</Td>
                    <Td fontWeight={"bold"}>
                      {selectedStudent.student.feePaidAmount} DT
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        onClick={() =>
                          handleEdit(
                            "student.feePaidAmount",
                            selectedStudent.student.feePaidAmount
                          )
                        }
                      >
                        {t("Modify")}
                      </Button>
                    </Td>
                  </Tr>

                  <Tr>
                    <Td
                      colSpan={3}
                      py={
                        isOpen && editField === "student.feePaidAmount" ? 2 : 0
                      }
                      transition="padding 0.3s ease"
                    >
                      <Collapse
                        in={isOpen && editField === "student.feePaidAmount"}
                      >
                        <Box>
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={"10px"}
                          >
                            <Box w={"50%"}>
                              <InputGroup size={"sm"}>
                                <Input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  max={40} // Set max value for feePaidAmount
                                />
                                <InputRightAddon>DT</InputRightAddon>
                              </InputGroup>
                            </Box>
                            <Box>
                              <IconButton
                                size={"sm"}
                                colorScheme="green"
                                icon={<CheckIcon />}
                                onClick={() =>
                                  handleSave("student.feePaidAmount")
                                }
                                isDisabled={
                                  editValue > 40 || !isSaveButtonEnabled
                                } // Disable Save button if value > 40
                              >
                                {t("Save")}
                              </IconButton>
                            </Box>
                            <Box>
                              <IconButton
                                size={"sm"}
                                colorScheme="red"
                                icon={<CloseIcon />}
                                onClick={handleCancel}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Collapse>
                    </Td>
                  </Tr>

                  <Tr bg={"Teal"}>
                    <Td>{t("Book Fee Paid Amount")}</Td>
                    <Td fontWeight={"bold"}>
                      {selectedStudent.student.bookPaidAmount} {"  "}DT
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        onClick={() =>
                          handleEdit(
                            "student.bookPaidAmount",
                            selectedStudent.student.bookPaidAmount
                          )
                        }
                      >
                        {t("Modify")}
                      </Button>
                    </Td>
                  </Tr>

                  <Tr>
                    <Td
                      colSpan={3}
                      py={
                        isOpen && editField === "student.bookPaidAmount" ? 2 : 0
                      }
                      transition="padding 0.3s ease"
                    >
                      <Collapse
                        in={isOpen && editField === "student.bookPaidAmount"}
                      >
                        <Box>
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={"10px"}
                          >
                            <Box w={"50%"}>
                              <InputGroup size={"sm"}>
                                <Input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  max={5} // Set max value for bookPaidAmount
                                />
                                <InputRightAddon>DT</InputRightAddon>
                              </InputGroup>
                            </Box>
                            <Box>
                              <IconButton
                                size={"sm"}
                                colorScheme="green"
                                icon={<CheckIcon />}
                                onClick={() =>
                                  handleSave("student.bookPaidAmount")
                                }
                                isDisabled={
                                  editValue > 5 || !isSaveButtonEnabled
                                } // Disable Save button if value > 5
                              >
                                {t("Save")}
                              </IconButton>
                            </Box>
                            <Box>
                              <IconButton
                                size={"sm"}
                                colorScheme="red"
                                icon={<CloseIcon />}
                                onClick={handleCancel}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Collapse>
                    </Td>
                  </Tr>
                </>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Box textAlign={"center"}>
          <Text fontSize={"lg"}>{t("No Student Selected")}</Text>
          <Text fontSize={"sm"}>{t("Please Select A Student.")}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Student;
