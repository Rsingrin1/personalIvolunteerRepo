// frontend/src/assets/SiteHeader.jsx
import React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function SiteHeader() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isLoggedIn = !!currentUser?.id;
  const userType = currentUser?.userType;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("organizerId");
    navigate("/");
  };

  // Decide default "My Events" route based on role
  const myEventsPath =
    userType === "organizer"
      ? "/MyEventsOrganizer"
      : userType === "volunteer"
      ? "/MyEventsVolunteer"
      : "/";

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      bg="white"
      borderBottom="1px solid #e2e8f0"
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        py={3}
        align="center"
        justify="space-between"
      >
        {/* Logo / Brand */}
        <Heading
          as={RouterLink}
          to="/landingPage"
          fontSize="24px"
          color="#181c71"
          _hover={{ textDecoration: "none", opacity: 0.9 }}
        >
          iVolunteer
        </Heading>

        {/* Nav links */}
        <HStack spacing={4}>
          <ChakraLink
            as={RouterLink}
            to="/events/search"
            fontSize="sm"
            color="gray.700"
          >
            Browse Events
          </ChakraLink>

          <ChakraLink
            as={RouterLink}
            to={myEventsPath}
            fontSize="sm"
            color="gray.700"
          >
            My Events
          </ChakraLink>

          <ChakraLink
            as={RouterLink}
            to="/calendar"
            fontSize="sm"
            color="gray.700"
          >
            Calendar
          </ChakraLink>

          {isLoggedIn && (
            <ChakraLink
              as={RouterLink}
              to="/Profile"
              fontSize="sm"
              color="gray.700"
            >
              Profile
            </ChakraLink>
          )}

          {!isLoggedIn ? (
            <Button
              as={RouterLink}
              to="/Login"
              size="sm"
              colorScheme="blue"
              variant="solid"
            >
              Login
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
