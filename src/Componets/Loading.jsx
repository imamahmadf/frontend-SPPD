import { Center, Spinner, Image, Flex, Text, Box } from "@chakra-ui/react";
// import LogoAPP from "../assets/logo app.png";
function Loading() {
  return (
    <Center h="100vh" flexDirection="column">
      <Image mb="20px" h="100px" src={""} alt="Turu Icon" />
      <Flex>
        <Text me="10px">Loading ...</Text> <Spinner color="primary" />
      </Flex>
    </Center>
  );
}

export default Loading;
