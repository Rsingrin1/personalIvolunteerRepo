import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  Spinner,
  SimpleGrid,
  VStack,
  Card,
  CardBody,
  Badge,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../assets/backArrow";
import SiteHeader from "../assets/SiteHeader";   // ✅ NEW IMPORT

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function EventsCalendar() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // calendar state
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // current user (from localStorage)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser?.id;
  const userType = currentUser?.userType;

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/events`);
        const data = await res.json();

        if (!res.ok) {
          setError(data?.message || "Failed to load events.");
          return;
        }

        setEvents(data || []);
      } catch {
        setError("Network error while loading events.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const prevMonth = () => {
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setYear((prev) => (month === 0 ? prev - 1 : prev));
  };

  const nextMonth = () => {
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setYear((prev) => (month === 11 ? prev + 1 : prev));
  };

  const firstDay = new Date(year, month, 1);
  const startingWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < startingWeekday; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // 🔹 Filter events for THIS user only
  const myEvents = events.filter((ev) => {
    if (!userId) return false;

    if (userType === "organizer") {
      const organizerId = ev.organizer?._id || ev.organizer;
      return organizerId === userId;
    }

    const applicants = ev.applicants || [];
    const participants = ev.participants || [];
    return applicants.includes(userId) || participants.includes(userId);
  });

  const myEventsThisMonth = myEvents.filter((ev) => {
    if (!ev.date) return false;
    const d = new Date(ev.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const eventsByDay = {};
  myEventsThisMonth.forEach((ev) => {
    const d = new Date(ev.date).getDate();
    if (!eventsByDay[d]) eventsByDay[d] = [];
    eventsByDay[d].push(ev);
  });

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  if (!userId) {
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
        <Text fontSize="xl" textAlign="center">
          Please log in to view your events calendar.
        </Text>
      </Box>
    );
  }

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

  return (
    <>
      {/* ✅ ONLY CHANGE — Add the global header */}
      <SiteHeader />

      <Box minH="100vh" bg="#1f49b6" color="white" pt={6} pb={20}>
        <Container maxW="6xl" px={4}>
          <BackArrow />

          <Heading textAlign="center" fontSize="60px" fontWeight="700" mb={3}>
            My Events Calendar
          </Heading>

          <HStack justify="center" spacing={6} mb={4}>
            <Button onClick={prevMonth} bg="white" color="#1f49b6">
              ← Previous
            </Button>
            <Heading fontSize="32px">
              {monthName} {year}
            </Heading>
            <Button onClick={nextMonth} bg="white" color="#1f49b6">
              Next →
            </Button>
          </HStack>

          {myEventsThisMonth.length === 0 && (
            <Text textAlign="center" fontSize="20px" mb={6}>
              You don't have any events this month.
            </Text>
          )}

          <SimpleGrid columns={7} spacing={4} mb={4}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Box
                key={day}
                textAlign="center"
                fontWeight="bold"
                fontSize="18px"
              >
                {day}
              </Box>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={7} spacing={4}>
            {calendarCells.map((day, idx) => (
              <Box
                key={idx}
                bg="white"
                borderRadius="md"
                minH="120px"
                color="black"
                p={2}
                boxShadow="md"
              >
                {!day && <Box h="100%" />}

                {day && (
                  <VStack align="stretch" spacing={2}>
                    <Text fontWeight="bold">{day}</Text>

                    {eventsByDay[day]?.map((ev) => (
                      <Card
                        key={ev._id}
                        bg="#1f49b6"
                        color="white"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => navigate(`/event/${ev._id}`)}
                        _hover={{ opacity: 0.9 }}
                      >
                        <CardBody p={2}>
                          <Text fontSize="sm" fontWeight="600">
                            {ev.name}
                          </Text>
                          <Badge colorScheme="purple" mt={1}>
                            {new Date(ev.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Badge>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}
