import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";

const Logo = () => {
  return (
    <Box
      h={"100%"}
      display="flex"
      alignItems={"center"}
      justifyContent="center"
    >
      {/* <Image src="./Association-Smaoui-Logo.png" alt="Logo" /> */}
      <Text
        bgGradient="linear(green.100 0%, teal.100 25%, blue.100 50%)"
        bgClip="text"
        fontSize="3xl"
        fontWeight="extrabold"
      >
        Your Logo Here
      </Text>
    </Box>
  );
};

export default Logo;
