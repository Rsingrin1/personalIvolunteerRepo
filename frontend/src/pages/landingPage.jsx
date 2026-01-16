import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  Grid,
  Card,
  CardBody,
} from "@chakra-ui/react";

import SiteHeader from "../assets/SiteHeader";

const signUpCards = [
  {
    title: "Volunteer Sign Up",
    description:
      "Create an account to search and sign up for community volunteering events today!",
    image: "https://c.animaapp.com/mirxmmm4WbwQmJ/img/image-12.png",
    link: "/VolunteerSignUp",
  },
  {
    title: "Organizer Sign Up",
    description: "Create an account to host your own community events!",
    image: "https://c.animaapp.com/mirxmmm4WbwQmJ/img/image-13.png",
    link: "/OrganizerSignUp",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ✅ ONLY ADDITION (the header) */}
      <SiteHeader />

      {/* EVERYTHING BELOW IS 100% UNCHANGED */}
      <Box bg="white" w="100%">
        {/* Header Section */}
        <Flex direction="column" align="center" pt="60px" pb="175px" bg="white">
          <Heading fontSize="64px" fontWeight="700" color="#1e1e1e">
            iVolunteer
          </Heading>

          <Text mt={2} fontSize="20px" color="#a09b9b">
            Your Gateway to Doing Good.
          </Text>
        </Flex>

        {/* Blue Section */}
        <Flex
          bg="#1f49b6"
          direction="column"
          align="center"
          pt="68px"
          px="64px"
          pb="98px"
        >
          <Image
            w="190px"
            h="161px"
            src="https://c.animaapp.com/mirxmmm4WbwQmJ/img/image-1.png"
            alt="iVolunteer Logo"
          />

          {/* LOGIN BUTTON WITH LINK */}
          <Button
            as={Link}
            to="/Login"
            mt="42px"
            px="17px"
            py="26px"
            bg="#2c2c2c"
            color="white"
            fontSize="34px"
            borderRadius="12px"
            _hover={{ bg: "#3c3c3c" }}
          >
            Login
          </Button>

          {/* Sign-Up Cards */}
          <Grid
            mt="57px"
            w="100%"
            maxW="1312px"
            templateColumns="repeat(2, 1fr)"
            gap={12}
          >
            {signUpCards.map((card, index) => (
              <Card
                as={Link}
                to={card.link}
                key={index}
                bg="white"
                border="1px solid #d9d9d9"
                borderRadius="lg"
                transition="all 0.2s"
                _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
                cursor="pointer"
                textDecoration="none"
              >
                <CardBody display="flex" flexWrap="wrap" gap={6} p={6}>
                  <Box w="160px" h="160px" flexShrink={0}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>

                  <Box flex="1" minW="160px">
                    <Heading fontSize="28px" color="#1e1e1e" mb={2}>
                      {card.title}
                    </Heading>

                    <Text fontSize="16px" color="#757575">
                      {card.description}
                    </Text>
                  </Box>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Flex>
      </Box>
    </>
  );
}
