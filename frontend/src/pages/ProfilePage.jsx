import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import useUser from "../hooks/userInteractHook.jsx";
import SiteHeader from "../assets/SiteHeader";   // ✅ NEW IMPORT

export default function Profile() {
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("currentUser"))?.id;
  const { user, inputHandler, updateUser } = useUser(id);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await updateUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box bg="white" minH="100vh" w="full">

      {/* ✅ NEW SITE HEADER — minimal addition */}
      <SiteHeader />

      {/* Existing back button header */}
      <Box as="header" w="full" p={6}>
        <IconButton
          aria-label="Go back"
          icon={<Box as="span" fontSize="40px">←</Box>}
          variant="ghost"
          size="lg"
          onClick={() => navigate(-1)}
        />
      </Box>

      <Container maxW="md" centerContent pb={8}>
        <form style={{ width: "100%" }} onSubmit={submitForm}>
          <VStack spacing={8} w="full" px={4}>
            <Avatar
              size="2xl"
              src={user.imageUrl}
              alt={`Profile picture of ${user.username}`}
              name={user.username}
              w="242.3px"
              h="242.3px"
            />

            {/* USERNAME */}
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={user.username || ""}
                onChange={inputHandler}
              />
            </FormControl>

            {/* BIO */}
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                name="bio"
                value={user.bio || ""}
                onChange={inputHandler}
                minH="80px"
                resize="none"
              />
            </FormControl>

            {/* PHONE */}
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone"
                value={user.phone || ""}
                onChange={inputHandler}
              />
            </FormControl>

            {/* EMAIL */}
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={inputHandler}
              />
            </FormControl>

            {/* NOTIFICATIONS */}
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="notifications" mb={0}>
                Receive Notifications
              </FormLabel>

              <Switch
                id="notifications"
                name="notifications"
                isChecked={user.notifSetting || false}
                onChange={(e) =>
                  inputHandler({
                    target: {
                      name: "notifSetting",
                      value: e.target.checked,
                    },
                  })
                }
              />
            </FormControl>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              px="34.87px"
              py="26.15px"
              bg="#171b70"
              borderRadius="14.53px"
              _hover={{ bg: "#1f2380" }}
              color="white"
              fontWeight="bold"
              fontSize="20px"
            >
              Save Changes
            </Button>
          </VStack>
        </form>
      </Container>
    </Box>
  );
}
