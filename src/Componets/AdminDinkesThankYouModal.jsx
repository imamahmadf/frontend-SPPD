import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { userRedux } from "../Redux/Reducers/auth";

const LOGIN_PATHS = ["/login", "/pegawai/login"];
const TARGET_NAME = "drg. dewi rahayu";

const normalize = (value) => (value || "").trim().toLowerCase();

const isDewiRahayuUser = (user) => {
  if (!Array.isArray(user)) return false;
  return user.some((profile) => normalize(profile?.nama) === TARGET_NAME);
};

function AdminDinkesThankYouModal() {
  const location = useLocation();
  const user = useSelector(userRedux);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isFirstRender = useRef(true);
  const [answeredYes, setAnsweredYes] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 60, y: 10 });

  const moveNoButton = useCallback(() => {
    setNoButtonPos({
      x: Math.floor(Math.random() * 70) + 5,
      y: Math.floor(Math.random() * 60) + 5,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setAnsweredYes(false);
      setNoButtonPos({ x: 60, y: 10 });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (LOGIN_PATHS.includes(location.pathname)) return;

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const activeUser = user || storedUser;

    if (isDewiRahayuUser(activeUser)) {
      onOpen();
    }
  }, [location.pathname, user, onOpen]);

  const handleYes = () => {
    setAnsweredYes(true);
    setTimeout(onClose, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody pt={8} pb={4} textAlign="center">
          {answeredYes ? (
            <Text fontSize="lg" fontWeight="semibold" color="pink.500">
              i love you cintaku sayangku cantikku 💕
            </Text>
          ) : (
            <Text fontSize="lg" fontWeight="semibold">
              Kamu mau jadi pacar aku?
            </Text>
          )}
        </ModalBody>
        {!answeredYes && (
          <ModalFooter justifyContent="center" pb={8}>
            <Box position="relative" w="280px" h="100px">
              <Button
                colorScheme="pink"
                position="absolute"
                left="0"
                bottom="0"
                onClick={handleYes}
              >
                Ya
              </Button>
              <Button
                colorScheme="gray"
                variant="outline"
                position="absolute"
                left={`${noButtonPos.x}%`}
                top={`${noButtonPos.y}%`}
                onMouseEnter={moveNoButton}
                onClick={(e) => {
                  e.preventDefault();
                  moveNoButton();
                }}
              >
                Tidak
              </Button>
            </Box>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}

export default AdminDinkesThankYouModal;
