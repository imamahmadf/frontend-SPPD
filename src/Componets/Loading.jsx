import { Center, Spinner, Image, Flex, Text, Box } from "@chakra-ui/react";
// import LogoAPP from "../assets/logo app.png";
import LogoPena from "../assets/Logo Pena.png";
function Loading() {
  return (
    <Center bgColor={"white"} h="100vh" flexDirection="column">
      <Image mb="20px" h="200px" src={LogoPena} alt="Logo Pena" />
      <Flex>
        <Text h={"120px"} me="10px">
          Loading ...
        </Text>{" "}
        <Spinner color="primary" />
      </Flex>
    </Center>
  );
}

export default Loading;
