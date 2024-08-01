import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { t } from "i18next";
import React, { useState } from "react";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    gender: "",
    parentFullName: "",
    parentPhoneNumber: "",
    cin: "",
    occupation: "",
    classYear: "",
  });

  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const handleSave = (event) => {
    event.preventDefault();

    const {
      fullName,
      birthday,
      gender,
      parentFullName,
      parentPhoneNumber,
      cin,
      occupation,
      classYear,
    } = formData;

    if (!fullName.trim()) {
      toast({
        title: "Error",
        description: "Student full name is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!birthday) {
      toast({
        title: "Error",
        description: "Student birthday is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!parentFullName.trim()) {
      toast({
        title: "Error",
        description: "Parent full name is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (
      isNaN(parentPhoneNumber.replace(/\s/g, "")) ||
      parentPhoneNumber.replace(/\s/g, "").length !== 8
    ) {
      toast({
        title: "Error",
        description: "Parent phone number must be 8 digits",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isNaN(cin.replace(/\s/g, "")) || cin.replace(/\s/g, "").length !== 8) {
      toast({
        title: "Error",
        description: "CIN must be 8 digits",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const studentId = Date.now() + Math.random().toString(36).substr(2, 9);

    const student = {
      id: studentId,
      fullName: capitalizeWords(fullName),
      birthday,
      gender,
      classYear,
    };

    const parent = {
      fullName: capitalizeWords(parentFullName),
      phoneNumber: parentPhoneNumber.replace(/\s/g, ""),
      cin: cin.replace(/\s/g, ""),
      occupation: capitalizeWords(occupation),
    };

    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.push({ student, parent });
    localStorage.setItem("students", JSON.stringify(students));

    // Reset form fields
    setFormData({
      fullName: "",
      birthday: "",
      gender: "",
      parentFullName: "",
      parentPhoneNumber: "",
      cin: "",
      occupation: "",
      classYear: "",
    });

    toast({
      title: "Success",
      description: "Student and parent information added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <FormControl isRequired as={"form"} onSubmit={handleSave}>
      {/* Change display flex to block for base screens */}
      <Box display="flex">
        <Stack p={"5px"} flex={1}>
          <Center>
            <Button size={"sm"} pointerEvents="none" colorScheme="blue">
              {t("Student's Info")}
            </Button>
          </Center>
          <Box>
            <FormLabel>{t("Full Name")}</FormLabel>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </Box>

          <Box>
            <FormLabel>{t("Date Of Birth")}</FormLabel>
            <Input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
            />
          </Box>
          <Box>
            <FormLabel>{t("Gender")}</FormLabel>
            <Select
              placeholder="Select Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="Boy">{t("Boy")}</option>
              <option value="Girl">{t("Girl")}</option>
            </Select>
          </Box>
          <Box>
            <FormLabel>{t("Class Year")}</FormLabel>
            <Select
              placeholder="Select Class"
              name="classYear"
              value={formData.classYear}
              onChange={handleInputChange}
            >
              <option value="Préscolaire">{t("Préscolaire")}</option>
              <option value="1ere Primaire">{t("1ere Année Primaire")}</option>
              <option value="2eme Primaire">{t("2eme Année Primaire")}</option>
              <option value="3eme Primaire">{t("3eme Année Primaire")}</option>
              <option value="4eme Primaire">{t("4eme Année Primaire")}</option>
              <option value="5eme Primaire">{t("5eme Année Primaire")}</option>
              <option value="6eme Primaire">{t("6eme Année Primaire")}</option>
              <option value="7eme De Base">{t("7eme Année De Base")}</option>
              <option value="8eme De Base">{t("8eme Année De Base")}</option>
              <option value="9eme De Base">{t("9eme Année De Base")}</option>
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
        </Stack>

        <Box display="flex" alignItems="center" justifyContent="center">
          <Divider height="90%" orientation="vertical" />
        </Box>

        <Stack p={"5px"} flex={1}>
          <Center>
            <Button size={"sm"} pointerEvents="none" colorScheme="blue">
              {t("Parent's Info")}
            </Button>
          </Center>

          <Box>
            <FormLabel>{t("Full Name")}</FormLabel>
            <Input
              type="text"
              name="parentFullName"
              value={formData.parentFullName}
              onChange={handleInputChange}
            />
          </Box>

          <Box>
            <FormLabel>{t("Phone Number:")}</FormLabel>
            <Input
              type="tel"
              name="parentPhoneNumber"
              value={formData.parentPhoneNumber}
              onChange={(e) => {
                let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                input = input.slice(0, 8); // Limit to maximum 8 digits
                input = input.replace(/^(\d{2})(\d{3})(\d{3})/, "$1 $2 $3"); // Format with spaces
                setFormData((prev) => ({ ...prev, parentPhoneNumber: input }));
              }}
            />
          </Box>

          <Box>
            <FormLabel>{t("National Card Number")}</FormLabel>
            <Input
              type="text"
              name="cin"
              value={formData.cin}
              onChange={(e) => {
                let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                input = input.slice(0, 8); // Limit to maximum 8 digits
                input = input.replace(/^(\d{3})(\d{3})(\d{2})/, "$1 $2 $3"); // Format with spaces
                setFormData((prev) => ({ ...prev, cin: input }));
              }}
            />
          </Box>

          <Box>
            <FormLabel>{t("Occupation")}</FormLabel>
            <Input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
            />
          </Box>
        </Stack>
      </Box>
      <Box
        p={"5px"}
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button colorScheme="blue" type={"submit"}>
          {t("Add Student To Association")}
        </Button>
      </Box>
    </FormControl>
  );
};

export default AddStudent;
