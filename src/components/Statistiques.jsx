import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Collapse,
  StatArrow,
  Divider,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { t } from "i18next";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import {
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

const Statistiques = ({ refreshData }) => {
  const [subscriptionFees, setSubscriptionFees] = useState(0);
  const [bookFees, setBookFees] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [studentsNotFullyPaid, setStudentsNotFullyPaid] = useState(0);
  const [studentsWithoutBook, setStudentsWithoutBook] = useState(0);
  const [creationDate, setCreationDate] = useState("");

  useEffect(() => {
    const storedDate = localStorage.getItem("creationDate");
    if (storedDate) {
      const creationDateObj = new Date(storedDate);
      setCreationDate(format(creationDateObj, "MMM dd")); // Format as "Jul 26"
    }
  }, []);

  const calculateFees = () => {
    // Fetch workspace data from local storage
    const workspaceData = localStorage.getItem("workspace");

    let totalSubscriptionFees = 0;
    let totalBookFees = 0;
    let notFullyPaidCount = 0;
    let noBookCount = 0;

    if (workspaceData) {
      const workspaceArray = JSON.parse(workspaceData);

      // Assuming workspaceArray is an array of objects with student and parent information
      workspaceArray.forEach((item) => {
        if (item.student) {
          totalSubscriptionFees += item.student.feePaidAmount || 0;
          totalBookFees += item.student.bookPaidAmount || 0;
          if ((item.student.feePaidAmount || 0) < 40) {
            notFullyPaidCount++;
          }
          if ((item.student.bookPaidAmount || 0) === 0) {
            noBookCount++;
          }
        }
      });
    }

    setSubscriptionFees(totalSubscriptionFees);
    setBookFees(totalBookFees);
    setTotalFees(totalSubscriptionFees + totalBookFees);
    setStudentsNotFullyPaid(notFullyPaidCount);
    setStudentsWithoutBook(noBookCount);
  };

  useEffect(() => {
    // Initial calculation
    calculateFees();

    // Event listener for local storage changes
    const handleStorageChange = () => {
      calculateFees();
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Recalculate when refreshData function changes (optional)
    if (refreshData) {
      refreshData();
    }
  }, [refreshData]);

  // MASARIF AL CHA7N

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();
  const { isOpen: isCollapseOpen, onToggle: toggleCollapse } = useDisclosure();

  useEffect(() => {
    // Fetch expenses from local storage on component mount
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(savedExpenses);
  }, []);

  const addExpense = () => {
    if (!label || !amount) {
      toast({
        title: "Error",
        description: "Please fill in both fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;

    const newExpense = {
      id: Date.now(), // Unique ID for the expense
      label,
      amount,
      date: formattedDate, // Format as DD/MM
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    // Clear input fields
    setLabel("");
    setAmount("");
  };

  const deleteExpense = (id) => {
    setDeletingId(id);
    onOpen();
  };

  const handleDelete = () => {
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== deletingId
    );
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    onClose();
  };

  const totalItems = expenses.length;
  const totalExpenses = expenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );
  const net = totalFees - totalExpenses;
  const percentage = (net / totalFees) * 100;

  return (
    <Stack>
      <Box
        border={"1px solid white"}
        rounded={"full"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-around"}
        p={2.5}
      >
        <Box>
          <Stat>
            <StatLabel>
              {t("Subscription")}
              <br />
              {t("Incomes")}
            </StatLabel>

            <StatNumber>{subscriptionFees.toFixed(2)} DT</StatNumber>
            <StatHelpText>
              <Text
                as={"b"}
                color={studentsNotFullyPaid === 0 ? "blue.300" : "tomato"}
              >
                {studentsNotFullyPaid}{" "}
              </Text>
              {t("Unpaid Students")}
            </StatHelpText>
          </Stat>
        </Box>
        <Box>
          <Stat>
            <StatLabel>
              {t("The Book")}
              <br />
              {t("Incomes")}
            </StatLabel>

            <StatNumber>{bookFees.toFixed(2)} DT</StatNumber>
            <StatHelpText>
              <Text
                as={"b"}
                color={studentsWithoutBook === 0 ? "blue.300" : "yellow"}
              >
                {studentsWithoutBook}{" "}
              </Text>
              {t("Unbought Books")}
            </StatHelpText>
          </Stat>
        </Box>
        <Box>
          <Stat>
            <StatLabel>
              {t("Total Summer")}
              <br />
              {t("Incomes")}
            </StatLabel>

            <StatNumber>{totalFees.toFixed(2)} DT</StatNumber>
            <StatHelpText>
              <Text as={"b"} color={"blue.300"}>
                {t("Since")}{" "}
              </Text>
              {creationDate}
            </StatHelpText>
          </Stat>
        </Box>
      </Box>

      <Box
        border={"1px solid white"}
        rounded={"full"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-around"}
        p={2.5}
      >
        <Box>
          <Stat>
            <StatLabel>
              {t("Total")}
              <br />
              {t("Spending")}
            </StatLabel>
            <StatNumber>{totalExpenses.toFixed(2)} DT</StatNumber>
            <StatHelpText>
              <Text as="b" color="green.400">
                {totalItems}
              </Text>
              {totalItems === 1 ? " Expense Recorded" : " Expenses Recorded"}
            </StatHelpText>
          </Stat>
        </Box>

        <Box>
          <Stat>
            <StatLabel>
              {t("Net")}
              <br />
              {t("Incomes")}
            </StatLabel>
            <StatNumber>{net.toFixed(2)} DT</StatNumber>
            <StatHelpText>
              <StatArrow type={net < 0 ? "decrease" : "increase"} />
              {percentage.toFixed(2)}%
            </StatHelpText>
          </Stat>
        </Box>
      </Box>

      {/* Expenses */}

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"5px"}
      >
        <Button
          w={"full"}
          rounded={"full"}
          colorScheme="blue"
          onClick={toggleCollapse}
        >
          {t("Add New Expense")}
        </Button>
        <IconButton
          fontSize={"33px"}
          colorScheme="blue"
          pointerEvents={"none"}
          isRound={true}
          icon={isCollapseOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        />
      </Box>
      <Collapse in={isCollapseOpen} animateOpacity>
        <Box>
          <Box border="1px solid white" rounded="xl" p={2.5}>
            <Stack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <TagRoundedIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Expense Label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <PaidRoundedIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="number"
                  placeholder="Expense Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </InputGroup>

              <Box>
                <Button colorScheme="blue" w="full" onClick={addExpense}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap="10px"
                  >
                    <Text>{t("Add")}</Text>
                    <AddIcon />
                  </Box>
                </Button>
              </Box>

              <Divider />

              <Center>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={"5px"}
                  bg="teal"
                  rounded="full"
                  py={2.5}
                  px={2.5 * 10}
                >
                  <Text as="samp" textAlign={"center"}>
                    {t("Expense History")}
                  </Text>
                  <HistoryRoundedIcon />
                </Box>
              </Center>

              <Box>
                {expenses
                  .slice()
                  .reverse()
                  .map((expense) => (
                    <Box
                      key={expense.id}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      border="1px solid white"
                      rounded="xl"
                      mb={"5px"}
                      p="5px"
                    >
                      <Text>
                        {expense.date} | {expense.label} -{" "}
                        <Text as="b">{expense.amount} DT</Text>
                      </Text>
                      <IconButton
                        size="xs"
                        colorScheme="red"
                        icon={<DeleteIcon />}
                        onClick={() => deleteExpense(expense.id)}
                      />
                    </Box>
                  ))}
              </Box>
            </Stack>

            {/* Confirmation Dialog */}
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    {t("Delete Expense")}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    {t("Are you sure? You cannot undo this action.")}
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      {t("Cancel")}
                    </Button>
                    <Button colorScheme="red" onClick={handleDelete} ml={3}>
                      {t("Delete")}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Box>
        </Box>
      </Collapse>
    </Stack>
  );
};

export default Statistiques;
