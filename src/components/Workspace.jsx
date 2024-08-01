import { Avatar, Box, HStack, IconButton, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import { StudentContext } from "../contexts/StudentContext";
import { TabContext } from "../contexts/TabContext";
import { PhoneIcon } from "@chakra-ui/icons";
import { t } from "i18next";

const Workspace = () => {
  const [studentList, setStudentList] = useState([]);
  const [isAgeSortedAsc, setIsAgeSortedAsc] = useState(true);
  const [isAlphaSortedAsc, setIsAlphaSortedAsc] = useState(true);
  const [isSortedByAge, setIsSortedByAge] = useState(false);

  const { setSelectedStudentId } = useContext(StudentContext);
  const { setTabIndex } = useContext(TabContext);

  const handleStudentClick = (studentId) => {
    setSelectedStudentId(studentId);
    setTabIndex(2);
  };

  const updateStudentList = () => {
    const students = JSON.parse(localStorage.getItem("workspace")) || [];
    const validStudents = students.filter(
      (item) => item.student && item.student.fullName && item.student.birthday // Ensure student data is available
    );
    setStudentList(
      validStudents.map((item) => ({
        ...item.student,
        parent: item.parent, // Attach parent information to each student
        feePaidAmount: item.student.feePaidAmount || 0, // Default to 0 if not provided
        bookPaidAmount: item.student.bookPaidAmount || 0, // Default to 0 if not provided
        feePaid: item.student.feePaidAmount >= 40, // Check if full fee is paid
        bookPaid: item.student.bookPaidAmount >= 5, // Book is considered paid if at least 5
        noBook: item.student.bookPaidAmount === 0, // Book is considered not bought if exactly 0
      }))
    );
    setIsSortedByAge(false); // Reset the sorting flag
  };

  // Initial load of students on component mount
  useEffect(() => {
    updateStudentList();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const groupStudentsByLetter = (students) => {
    const groupedStudents = {};
    students.forEach((student) => {
      const firstLetter = student.fullName.charAt(0).toUpperCase();
      if (!groupedStudents[firstLetter]) {
        groupedStudents[firstLetter] = [];
      }
      groupedStudents[firstLetter].push(student);
    });
    return groupedStudents;
  };

  // Function to handle manual refresh
  const handleRefresh = () => {
    updateStudentList(); // Update student list from localStorage
  };

  const handleSortByAge = () => {
    const sortedStudents = [...studentList].sort((a, b) => {
      const ageA = calculateAge(a.birthday);
      const ageB = calculateAge(b.birthday);
      return isAgeSortedAsc ? ageA - ageB : ageB - ageA;
    });
    setStudentList(sortedStudents);
    setIsAgeSortedAsc(!isAgeSortedAsc); // Toggle sorting order
    setIsSortedByAge(true); // Set sorting flag
  };

  const handleSortByAlphabet = () => {
    const sortedStudents = [...studentList].sort((b, a) =>
      isAlphaSortedAsc
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName)
    );
    setStudentList(sortedStudents);
    setIsAlphaSortedAsc(!isAlphaSortedAsc); // Toggle sorting order
    setIsSortedByAge(false); // Reset the sorting flag
  };

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

  const groupedStudents = groupStudentsByLetter(studentList);

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    return phoneNumber
      .replace(/\D/g, "") // Remove non-digit characters
      .slice(0, 8) // Limit to 8 digits
      .replace(/(\d{2})(\d{3})?(\d{3})?/, "$1 $2 $3")
      .trim();
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      maxH="100%"
      overflowY="auto"
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
      <Box
        p="5px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        borderBottom="1px solid white"
        borderRadius={"10px"}
      >
        <Text>
          {t("Total Students In")} <Text as="b">{t("Workspace")}</Text> :{" "}
          {studentList.length}
        </Text>
        <HStack>
          <IconButton
            size="s"
            isRound
            colorScheme="blue"
            icon={<RefreshRoundedIcon />}
            onClick={handleRefresh}
          />
          <IconButton
            size="s"
            isRound
            colorScheme="blue"
            icon={<SortByAlphaRoundedIcon />}
            onClick={handleSortByAlphabet}
          />
          <IconButton
            size="s"
            isRound
            colorScheme="blue"
            icon={<SwapVertRoundedIcon />}
            onClick={handleSortByAge}
          />
        </HStack>
      </Box>

      {isSortedByAge
        ? studentList.map((student, index) => (
            <Box
              key={index}
              w="100%"
              px="10px"
              py="5px"
              display="flex"
              alignItems="center"
              borderBottom="1px solid white"
              cursor="pointer"
              _hover={{
                background: "gray.700",
              }}
              onClick={() => handleStudentClick(student.id)}
            >
              <Box
                p="5px"
                borderWidth={2}
                borderRadius="full"
                borderColor="gray.300"
                backgroundColor="gray.300"
              >
                <Avatar
                  src={student.gender === "Boy" ? "guy.png" : "woman.png"}
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
                      {t("Subscription Unpaid")} ({student.feePaidAmount} DT)
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
                    <Text whiteSpace={"nowrap"} fontSize="xs" color="green.500">
                      {t("Book Paid")}
                    </Text>
                  ) : (
                    <Text whiteSpace={"nowrap"} fontSize="xs" color="red.500">
                      {t("Book Unpaid")} ({student.bookPaidAmount} DT)
                    </Text>
                  )}
                </Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Text>{student.fullName}</Text>
                  <Text>
                    {calculateAge(student.birthday)} {t("Y.O")}
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
          ))
        : Object.keys(groupedStudents).map((letter) => (
            <Box key={letter} w="100%">
              <Box
                px="5px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text fontSize="xs" fontWeight="bold">
                  {letter}
                </Text>
              </Box>

              {groupedStudents[letter].map((student, index) => (
                <Box
                  key={index}
                  w="100%"
                  px="10px"
                  py="5px"
                  display="flex"
                  alignItems="center"
                  borderBottom="1px solid white"
                  cursor="pointer"
                  _hover={{
                    background: "gray.700",
                  }}
                  onClick={() => handleStudentClick(student.id)}
                >
                  <Box
                    p="5px"
                    borderWidth={2}
                    borderRadius="full"
                    borderColor="gray.300"
                    backgroundColor="gray.300"
                  >
                    <Avatar
                      src={student.gender === "Boy" ? "guy.png" : "woman.png"}
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
                          {t("Subscription Unpaid")} ({student.feePaidAmount}{" "}
                          DT)
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
                      <Text>{student.fullName}</Text>
                      <Text>
                        {calculateAge(student.birthday)} {t("Y.O")}
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
          ))}
    </Box>
  );
};

export default Workspace;
