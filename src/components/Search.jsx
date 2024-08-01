import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  VStack,
  Button,
  Text,
  Avatar,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { StudentContext } from "../contexts/StudentContext";
import { TabContext } from "../contexts/TabContext";
import { PhoneIcon } from "@chakra-ui/icons";
import { t } from "i18next";

const Search = ({
  setHasResults,
  setShowStudents,
  isHistoryVisible,
  isWorkspaceVisible,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("Full Name");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setSelectedStudentId } = useContext(StudentContext);
  const { setTabIndex } = useContext(TabContext);

  useEffect(() => {
    const studentsFromLocalStorage =
      JSON.parse(localStorage.getItem("students")) || [];
    const workspaceFromLocalStorage =
      JSON.parse(localStorage.getItem("workspace")) || [];

    let studentsWithWorkspaceStatus = studentsFromLocalStorage.map(
      (student) => {
        const workspaceStudent = workspaceFromLocalStorage.find(
          (wsStudent) => wsStudent.student.id === student.student.id
        );

        return {
          ...student,
          isInWorkspace: !!workspaceStudent,
          feePaidAmount: workspaceStudent
            ? workspaceStudent.student.feePaidAmount
            : 0,
          bookPaidAmount: workspaceStudent
            ? workspaceStudent.student.bookPaidAmount
            : 0,
          feePaid:
            (workspaceStudent &&
              workspaceStudent.student.feePaidAmount >= 40) ||
            false,
          bookPaid:
            (workspaceStudent &&
              workspaceStudent.student.bookPaidAmount >= 5) ||
            false,
          noBook:
            (workspaceStudent &&
              workspaceStudent.student.bookPaidAmount === 0) ||
            false,
        };
      }
    );

    if (isHistoryVisible || isWorkspaceVisible) {
      setStudents(studentsWithWorkspaceStatus);
    }
  }, [isHistoryVisible, isWorkspaceVisible]);

  useEffect(() => {
    const filteredStudents = students.filter((student) => {
      switch (searchBy) {
        case "Full Name":
          return student?.student?.fullName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
        case "Date Of Birth":
          return student?.student?.birthday?.includes(searchQuery);
        case "Phone Number":
          return student?.parent?.phoneNumber?.includes(searchQuery);
        default:
          return false;
      }
    });

    const finalFilteredStudents = isWorkspaceVisible
      ? filteredStudents.filter((student) => student.isInWorkspace)
      : filteredStudents;

    setFilteredStudents(finalFilteredStudents);

    if (searchQuery) {
      if (finalFilteredStudents.length > 0) {
        setHasResults(true);
        setShowStudents(true);
      } else {
        setHasResults(false);
        setShowStudents(false);
      }
    } else {
      setHasResults(false);
      setShowStudents(true);
    }
  }, [
    searchQuery,
    searchBy,
    students,
    isWorkspaceVisible,
    setHasResults,
    setShowStudents,
  ]);

  const handleSearchByChange = (newSearchBy) => {
    setSearchBy(newSearchBy);
    setSearchQuery("");
  };

  const handleStudentClick = (studentId) => {
    setSelectedStudentId(studentId);
    setTabIndex(2);
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) {
      console.error("Birthdate is not defined or empty");
      return NaN;
    }

    const today = new Date();
    const birthDate = new Date(birthdate);

    if (isNaN(birthDate)) {
      console.error("Invalid birthdate:", birthdate);
      return NaN;
    }

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

  const getInputType = () => {
    switch (searchBy) {
      case "Date Of Birth":
        return "date";
      case "Phone Number":
        return "number";
      default:
        return "text";
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    return phoneNumber
      .replace(/\D/g, "") // Remove non-digit characters
      .slice(0, 8) // Limit to 8 digits
      .replace(/(\d{2})(\d{3})?(\d{3})?/, "$1 $2 $3")
      .trim();
  };

  return (
    <Box>
      <Box
        h={"100%"}
        py={"5px"}
        px={"10px"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={"5px"}
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchRoundedIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type={getInputType()}
            placeholder={`Search By ${searchBy}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Popover placement="bottom-end" isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>
            <IconButton icon={<SettingsRoundedIcon />} onClick={onOpen} />
          </PopoverTrigger>
          <PopoverContent maxW={"max-content"}>
            <PopoverArrow />
            <PopoverHeader textAlign={"center"}>
              {t("Search By?")}
            </PopoverHeader>
            <PopoverBody>
              <VStack justifyContent={"center"}>
                <Button
                  w={"full"}
                  onClick={() => {
                    handleSearchByChange("Full Name");
                    onClose();
                  }}
                  isActive={searchBy === "Full Name"}
                >
                  {t("Full Name")}
                </Button>
                <Button
                  w={"full"}
                  onClick={() => {
                    handleSearchByChange("Date Of Birth");
                    onClose();
                  }}
                  isActive={searchBy === "Date Of Birth"}
                >
                  {t("Date Of Birth")}
                </Button>
                <Button
                  w={"full"}
                  onClick={() => {
                    handleSearchByChange("Phone Number");
                    onClose();
                  }}
                  isActive={searchBy === "Phone Number"}
                >
                  {t("Phone Number")}
                </Button>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
      {searchQuery && (
        <Box>
          {isHistoryVisible && (
            <Box>
              {filteredStudents.length > 0 ? (
                <Box px={"5px"}>
                  <Text>{t("Search Results :")}</Text>
                  <Box>
                    {filteredStudents.map((student) => (
                      <Box
                        key={student.student.id}
                        w={"100%"}
                        px={"10px"}
                        py={"5px"}
                        display="flex"
                        alignItems="center"
                        borderBottom={"1px solid white"}
                        cursor={"pointer"}
                        _hover={{
                          background: "gray.700",
                        }}
                        onClick={() => handleStudentClick(student.student.id)}
                      >
                        <Box
                          p={"5px"}
                          borderWidth={2}
                          borderRadius="full"
                          borderColor="gray.300"
                          backgroundColor={"gray.300"}
                        >
                          <Avatar
                            src={
                              student.student.gender === "Boy"
                                ? "guy.png"
                                : "woman.png"
                            }
                          />
                        </Box>
                        <Box mx="10px" w={"full"}>
                          {student.isInWorkspace && (
                            <Text fontSize="xs" color="green.500">
                              {t("Workspace Member")}
                            </Text>
                          )}
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Text>{student.student.fullName}</Text>
                            <Text>
                              {calculateAge(student.student.birthday)}{" "}
                              {t("Y.O")}
                            </Text>
                          </Box>

                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Text fontSize="xs">{student.parent.fullName}</Text>
                            <HStack
                              alignItems="center"
                              justifyContent="flex-end"
                              whiteSpace={"nowrap"}
                            >
                              <PhoneIcon fontSize={"xs"} />
                              <Text fontSize="xs">
                                {formatPhoneNumber(student.parent.phoneNumber)}
                              </Text>
                            </HStack>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box px={"5px"}>
                  <Text>{t("Search Results : 0")}</Text>
                </Box>
              )}
            </Box>
          )}

          {/* Workplace */}

          {isWorkspaceVisible && (
            <Box>
              {filteredStudents.length > 0 ? (
                <Box px={"5px"}>
                  <Text>Search Results :</Text>
                  <Box>
                    {filteredStudents.map((student) => (
                      <Box
                        key={student.student.id}
                        w={"100%"}
                        px={"10px"}
                        py={"5px"}
                        display="flex"
                        alignItems="center"
                        borderBottom={"1px solid white"}
                        cursor={"pointer"}
                        _hover={{
                          background: "gray.700",
                        }}
                        onClick={() => handleStudentClick(student.student.id)}
                      >
                        <Box
                          p={"5px"}
                          borderWidth={2}
                          borderRadius="full"
                          borderColor="gray.300"
                          backgroundColor={"gray.300"}
                        >
                          <Avatar
                            src={
                              student.student.gender === "Boy"
                                ? "guy.png"
                                : "woman.png"
                            }
                          />
                        </Box>
                        <Box mx="10px" w={"full"}>
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            {student.feePaid ? (
                              <Text fontSize="xs" color="green.500">
                                {t("Subscription Paid")}
                              </Text>
                            ) : (
                              <Text fontSize="xs" color="red.500">
                                {t("Subscription Unpaid")} (
                                {student.feePaidAmount} DT)
                              </Text>
                            )}
                            {student.noBook ? (
                              <Text
                                whiteSpace={"nowrap"}
                                fontSize="xs"
                                color="yellow.500"
                              >
                                {t("Book Not Bought")}
                              </Text>
                            ) : student.bookPaid ? (
                              <Text
                                whiteSpace={"nowrap"}
                                fontSize="xs"
                                color="green.500"
                              >
                                {t("Book Paid")}
                              </Text>
                            ) : (
                              <Text
                                whiteSpace={"nowrap"}
                                fontSize="xs"
                                color="red.500"
                              >
                                {t("Book Unpaid")} ({student.bookPaidAmount} DT)
                              </Text>
                            )}
                          </Box>

                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Text>{student.student.fullName}</Text>
                            <Text>
                              {calculateAge(student.student.birthday)}{" "}
                              {t("Y.O")}
                            </Text>
                          </Box>

                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Text w={"60%"} fontSize="xs">
                              {student.parent.fullName}
                            </Text>
                            <HStack
                              w={"40%"}
                              alignItems="center"
                              justifyContent="flex-end"
                              whiteSpace={"nowrap"}
                            >
                              <PhoneIcon fontSize={"xs"} />
                              <Text fontSize="xs">
                                {formatPhoneNumber(student.parent.phoneNumber)}
                              </Text>
                            </HStack>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box px={"5px"}>
                  <Text>{t("Search Results : 0")}</Text>
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Search;
