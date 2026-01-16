import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  Spinner,
  Image,
  Badge,
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import BackArrow from "../assets/backArrow";
import SiteHeader from "../assets/SiteHeader"; // ✅ NEW

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applyMessage, setApplyMessage] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser?.id;
  const userType = currentUser?.userType;
  const isVolunteer = userType === "volunteer";

  // Fetch event details
  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`${API_BASE}/api/event/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setApiError(data?.message || "Failed to load event.");
          return;
        }

        setEvent(data);
      } catch {
        setApiError("Network error while loading event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="#1f49b6"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="white" />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box
        minH="100vh"
        bg="#1f49b6"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={4}
      >
        <Text fontSize="xl">{apiError || "Event not found."}</Text>
      </Box>
    );
  }

  const dateObj = event.date ? new Date(event.date) : null;
  const dateStr = dateObj?.toLocaleDateString() || "No date";
  const timeStr = dateObj?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const applicants = event.applicants || [];
  const participants = event.participants || [];

  const alreadyApplied = applicants.includes(userId);
  const alreadyParticipant = participants.includes(userId);

  const canApply = isVolunteer && !alreadyApplied && !alreadyParticipant;

  // Apply to event
  const handleApply = async () => {
    setApplyError(null);
    setApplyMessage(null);

    if (!userId || !isVolunteer) {
      setApplyError("You must be logged in as a volunteer to apply.");
      return;
    }

    setApplying(true);
    try {
      const res = await fetch(`${API_BASE}/api/event/${id}/apply`, {
        method: "POST",
        credentials: "include", // send cookie
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        setApplyError(data?.message || "Not authorized. Please log in again.");
        return;
      }

      if (!res.ok) {
        setApplyError(data?.message || "Failed to apply to event.");
        return;
      }

      setApplyMessage(data?.message || "Successfully applied to event.");

      setEvent((prev) =>
        prev
          ? {
              ...prev,
              applicants: [...(prev.applicants || []), userId],
            }
          : prev
      );
    } catch {
      setApplyError("Network error while applying.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      {/* ✅ Global header added */}
      <SiteHeader />

      <Box minH="100vh" bg="#1f49b6" color="white" pt={6} pb={20}>
        <Container maxW="5xl" px={4}>
          <BackArrow />

          <Heading fontSize="48px" fontWeight="700" mb={4}>
            {event.name}
          </Heading>

          <HStack spacing={6} align="flex-start" mb={8} flexWrap="wrap">
            <Image
              src={
                event.imageUrl ||
                "https://via.placeholder.com/400x250?text=Event+Image"
              }
              alt={event.name}
              borderRadius="md"
              w={{ base: "100%", md: "400px" }}
              h="250px"
              objectFit="cover"
            />

            <VStack align="flex-start" spacing={3} flex={1}>
              <Text fontSize="lg">
                <strong>Date:</strong> {dateStr}
              </Text>
              {timeStr && (
                <Text fontSize="lg">
                  <strong>Time:</strong> {timeStr}
                </Text>
              )}
              {event.location && (
                <Text fontSize="lg">
                  <strong>Location:</strong> {event.location}
                </Text>
              )}

              {event.organizer && (
                <Text fontSize="md" opacity={0.9}>
                  <strong>Organizer:</strong>{" "}
                  {event.organizer.username ||
                    event.organizer.email ||
                    "Unknown"}
                </Text>
              )}

              {event.tags?.length > 0 && (
                <HStack spacing={2} flexWrap="wrap" mt={2}>
                  {event.tags.map((tag) => {
                    const tagId = tag._id || tag;
                    const tagName = typeof tag === "object" ? tag.name : tag;
                    return (
                      <Badge key={tagId} colorScheme="purple">
                        {tagName}
                      </Badge>
                    );
                  })}
                </HStack>
              )}
            </VStack>
          </HStack>

          {event.description && (
            <Box mb={6}>
              <Heading fontSize="24px" mb={2}>
                Description
              </Heading>
              <Text whiteSpace="pre-wrap">{event.description}</Text>
            </Box>
          )}

          {/* APPLY SECTION */}
          <Box mt={8}>
            {applyMessage && (
              <Alert status="success" mb={4} borderRadius="md">
                <AlertIcon />
                <Text>{applyMessage}</Text>
              </Alert>
            )}

            {applyError && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                <Text>{applyError}</Text>
              </Alert>
            )}

            {isVolunteer ? (
              <HStack spacing={4} align="center">
                <Button
                  bg="#181c71"
                  color="white"
                  borderRadius="lg"
                  px={6}
                  py={3}
                  h="auto"
                  _hover={{ bg: "#181c71", opacity: 0.9 }}
                  onClick={handleApply}
                  isLoading={applying}
                  isDisabled={!canApply}
                >
                  {alreadyParticipant
                    ? "You are confirmed for this event"
                    : alreadyApplied
                    ? "Already applied"
                    : "Apply to this event"}
                </Button>

                {!userId && (
                  <Text fontSize="sm">
                    You need to log in as a volunteer to apply.
                  </Text>
                )}
              </HStack>
            ) : (
              <Text fontSize="sm" opacity={0.9}>
                {userType === "organizer"
                  ? "You are logged in as an organizer. Volunteers can apply to this event from here."
                  : "Log in as a volunteer to apply to this event."}
              </Text>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}
