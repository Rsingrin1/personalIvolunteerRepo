// frontend/src/pages/ReviewApplicants.jsx
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../assets/profileMenu";
import SiteHeader from "../assets/SiteHeader";   // ⭐ NEW

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ReviewApplicants() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [participants, setParticipants] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userName = currentUser?.username || "Organizer";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("organizerId");
    navigate("/Login");
  };

  const loadApplicants = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch(`${API_BASE}/api/event/${eventId}/applicants`, {
        credentials: "include",
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setApiError(
          data?.message || "Error loading applicants for this event."
        );
        setApplicants([]);
        setParticipants([]);
        return;
      }

      setEventName(data.eventName || "");
      setEventDate(data.eventDate || null);
      setApplicants(Array.isArray(data.applicants) ? data.applicants : []);
      setParticipants(
        Array.isArray(data.participants) ? data.participants : []
      );
    } catch {
      setApiError("Network error while loading applicants.");
      setApplicants([]);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [eventId]);

  const approve = async (volunteerId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/event/${eventId}/approve/${volunteerId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        alert(data?.message || "Failed to approve volunteer.");
        return;
      }

      setApplicants((prev) => prev.filter((u) => u._id !== volunteerId));
      setParticipants((prev) => {
        const exists = prev.some((u) => u._id === volunteerId);
        if (exists) return prev;

        const moved = applicants.find((u) => u._id === volunteerId);
        return moved ? [...prev, moved] : prev;
      });
    } catch {
      alert("Network error while approving volunteer.");
    }
  };

  const deny = async (volunteerId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/event/${eventId}/deny/${volunteerId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        alert(data?.message || "Failed to deny volunteer.");
        return;
      }

      setApplicants((prev) => prev.filter((u) => u._id !== volunteerId));
      setParticipants((prev) => prev.filter((u) => u._id !== volunteerId));
    } catch {
      alert("Network error while denying volunteer.");
    }
  };

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleString()
    : null;

  return (
    <Box bg="white" minH="100vh">
      <SiteHeader />  {/* ⭐ NEW header */}

      {/* Existing Header */}
      <Flex
        as="header"
        justify="space-between"
        align="center"
        p={{ base: 4, md: 6 }}
      >
        <IconButton
          variant="ghost"
          aria-label="Go back"
          size="lg"
          _hover={{ bg: "transparent" }}
          onClick={() => navigate(-1)}
        >
          ←
        </IconButton>

        <Profile
          userName={userName}
          profilePic="https://bit.ly/dan-abramov"
          onLogout={handleLogout}
        />
      </Flex>

      <Container maxW="900px" px={{ base: 4, md: 6 }}>
        <Box mb={6} textAlign="center">
          <Heading
            as="h1"
            fontFamily="Inter, Helvetica"
            fontWeight={700}
            fontSize={{ base: "32px", md: "40px" }}
          >
            Review Applicants
          </Heading>

          {eventName && (
            <Text mt={2} color="gray.700" fontSize="lg">
              Event: <strong>{eventName}</strong>
            </Text>
          )}

          {formattedDate && (
            <Text mt={1} color="gray.500" fontSize="sm">
              {formattedDate}
            </Text>
          )}
        </Box>

        {loading ? (
          <Flex justify="center" pt={10}>
            <Spinner size="lg" />
          </Flex>
        ) : apiError ? (
          <Text textAlign="center" color="red.500">
            {apiError}
          </Text>
        ) : (
          <>
            {/* Pending */}
            <Box mb={6}>
              <Heading as="h2" size="md" mb={3}>
                Pending Applicants
              </Heading>

              {applicants.length === 0 ? (
                <Text color="gray.600">No pending applicants.</Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {applicants.map((user) => (
                    <ApplicantCard
                      key={user._id}
                      user={user}
                      status="pending"
                      onApprove={() => approve(user._id)}
                      onDeny={() => deny(user._id)}
                    />
                  ))}
                </VStack>
              )}
            </Box>

            {/* Approved */}
            <Box mb={6}>
              <Heading as="h2" size="md" mb={3}>
                Approved Volunteers
              </Heading>

              {participants.length === 0 ? (
                <Text color="gray.600">No approved volunteers yet.</Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {participants.map((user) => (
                    <ApplicantCard
                      key={user._id}
                      user={user}
                      status="approved"
                      onApprove={null}
                      onDeny={() => deny(user._id)}
                    />
                  ))}
                </VStack>
              )}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

function ApplicantCard({ user, status, onApprove, onDeny }) {
  const displayName = user.username || user.email || "Unnamed User";
  const displayEmail = user.email || "No email provided";

  const typeLabel =
    user.userType === "organizer"
      ? "Organizer"
      : user.userType === "volunteer"
      ? "Volunteer"
      : user.userType || "User";

  return (
    <Card borderWidth="1px" borderColor="#d9d9d9">
      <CardBody>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <HStack spacing={4}>
            <Avatar name={displayName} />
            <VStack align="flex-start" spacing={1}>
              <Text fontWeight="bold">{displayName}</Text>
              <Text fontSize="sm" color="gray.600">
                {displayEmail}
              </Text>

              <HStack spacing={2}>
                <Badge
                  colorScheme={status === "approved" ? "green" : "yellow"}
                >
                  {status === "approved" ? "Approved" : "Pending"}
                </Badge>

                <Badge colorScheme="blue" variant="subtle">
                  {typeLabel}
                </Badge>
              </HStack>
            </VStack>
          </HStack>

          <HStack spacing={2}>
            {status === "pending" && onApprove && (
              <Button
                bg="#181c71"
                color="white"
                _hover={{ opacity: 0.9 }}
                onClick={onApprove}
              >
                Approve
              </Button>
            )}

            {onDeny && (
              <Button
                variant="outline"
                borderColor="red.400"
                color="red.500"
                _hover={{ bg: "red.50" }}
                onClick={onDeny}
              >
                Deny
              </Button>
            )}
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
}
