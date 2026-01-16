import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  VStack,
  HStack,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Profile from "../assets/profileMenu";
import SiteHeader from "../assets/SiteHeader";


const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function MyEventsVolunteer() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser?.id;
  const userName = currentUser?.username;

  const handleLogout = () => {
    // cookie is cleared server-side if you add a logout route later;
    // for now we just clear local storage + send them to Login.
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("organizerId");
    navigate("/Login");
  };

  // Fetch ONLY this volunteer's events from backend
  useEffect(() => {
    const loadMyEvents = async () => {
      setLoading(true);
      setApiError(null);

      try {
        const res = await fetch(`${API_BASE}/api/my-events/volunteer`, {
          credentials: "include", // 🔥 send cookie with request
        });

        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (res.status === 401 || res.status === 403) {
          setApiError(
            data?.message || "You must be logged in as a volunteer to view this."
          );
          setEvents([]);
          return;
        }

        if (!res.ok) {
          setApiError(
            data?.message || "Error loading your events."
          );
          setEvents([]);
          return;
        }

        setEvents(Array.isArray(data) ? data : []);
      } catch {
        setApiError("Network error while loading your events.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadMyEvents();
  }, []);

  // If you later add a `participants` array or a status field to events,
  // you can split them like this. For now everything from the endpoint
  // is "applied" events.
  const approvedEvents = events.filter(
    (ev) => Array.isArray(ev.participants) && ev.participants.includes(userId)
  );
  const appliedEvents = events.filter(
    (ev) => !Array.isArray(ev.participants) || !ev.participants.includes(userId)
  );

  const hasNoEvents =
    !loading &&
    !apiError &&
    approvedEvents.length === 0 &&
    appliedEvents.length === 0;

  // Withdraw / cancel
  const cancelParticipation = async (eventId) => {
    try {
      const res = await fetch(`${API_BASE}/api/event/${eventId}/cancel`, {
        method: "POST",
        credentials: "include",
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok) {
        // Re-fetch or filter locally
        setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      } else {
        alert(data?.message || "Failed to cancel.");
      }
    } catch {
      alert("Network error while cancelling.");
    }
  };

  return (
    <Box bg="white" minH="100vh">
      <SiteHeader />

      {/* Header */}
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
          userName={userName || "Volunteer"}
          profilePic="https://bit.ly/dan-abramov"
          onLogout={handleLogout}
        />
      </Flex>

      {/* Main */}
      <Container maxW="1440px" px={{ base: 4, md: 6, lg: "175px" }}>
        {/* Title */}
        <Box mb={8}>
          <Heading
            as="h1"
            fontFamily="Inter, Helvetica"
            fontWeight={700}
            fontSize={{ base: "40px", md: "60px" }}
            textAlign="center"
          >
            My Events
          </Heading>
        </Box>

        {loading && (
          <Flex justify="center" pt={10}>
            <Spinner size="lg" />
          </Flex>
        )}

        {!loading && apiError && (
          <Text color="red.500" textAlign="center">
            {apiError}
          </Text>
        )}

        {hasNoEvents && (
          <Text textAlign="center" color="gray.600">
            You haven&apos;t applied to or been approved for any events yet.
          </Text>
        )}

        {/* Approved Events */}
        {!loading && !apiError && approvedEvents.length > 0 && (
          <Box mb={8}>
            <Heading size="lg" mb={4}>
              Approved Events
            </Heading>

            <VStack spacing={6} align="stretch">
              {approvedEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  navigate={navigate}
                  status="approved"
                  onCancel={() => cancelParticipation(event._id)}
                />
              ))}
            </VStack>
          </Box>
        )}

        {/* Applied (Pending) Events */}
        {!loading && !apiError && appliedEvents.length > 0 && (
          <Box mb={8}>
            <Heading size="lg" mb={4}>
              Applied (Pending Approval)
            </Heading>

            <VStack spacing={6} align="stretch">
              {appliedEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  navigate={navigate}
                  status="pending"
                  onCancel={() => cancelParticipation(event._id)}
                />
              ))}
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

function EventCard({ event, navigate, status, onCancel }) {
  const dateObj = event.date ? new Date(event.date) : null;
  const dateStr = dateObj?.toLocaleDateString() || "No date";
  const timeStr =
    dateObj &&
    dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card
      borderColor="#d9d9d9"
      borderWidth="1px"
      _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      transition="0.2s ease"
      cursor="pointer"
      onClick={() => navigate(`/event/${event._id}`)}
    >
      <CardBody p={6}>
        <Flex direction={{ base: "column", md: "row" }} gap={6}>
          <Image
            src={
              event.imageUrl ||
              "https://via.placeholder.com/171x159?text=Event"
            }
            alt={event.name}
            w={{ base: "100%", md: "171px" }}
            h="159px"
            objectFit="cover"
            borderRadius="md"
          />

          <Flex flex={1} direction="column" justify="space-between">
            <VStack align="stretch" spacing={2} mb={4}>
              <Heading as="h2" size="md">
                {event.name}
              </Heading>

              <Text opacity={0.7}>
                {timeStr && (
                  <>
                    {timeStr}
                    <br />
                  </>
                )}
                {dateStr}
              </Text>

              {status === "approved" && (
                <Badge colorScheme="green" w="fit-content">
                  Approved
                </Badge>
              )}

              {status === "pending" && (
                <Badge colorScheme="yellow" w="fit-content">
                  Pending Approval
                </Badge>
              )}
            </VStack>

            <Button
              bg="#181c71"
              color="white"
              borderRadius="lg"
              px={3}
              py={3}
              h="auto"
              _hover={{ bg: "#181c71", opacity: 0.9 }}
              onClick={(e) => {
                e.stopPropagation(); // prevent opening event details
                onCancel();
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}
