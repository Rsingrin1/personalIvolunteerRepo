// frontend/src/pages/EventsSearch.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  Spinner,
  VStack,
  HStack,
  Button,
  Input,
  Card,
  CardBody,
  Badge,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import BackArrow from "../assets/backArrow";
import SiteHeader from "../assets/SiteHeader";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function EventsSearch() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // fetched list of all tags from backend (so we show every tag, not only tags used by loaded events)
  const [availableTagNames, setAvailableTagNames] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/events`);
        const data = await res.json();

        if (!res.ok) {
          setApiError(data?.message || "Failed to load events.");
          return;
        }

        setEvents(data || []);
      } catch {
        setApiError("Network error while loading events.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // fetch all tags once so the filter shows every tag defined in the system
  useEffect(() => {
    let mounted = true;
    const fetchTags = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/tags`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const names = Array.isArray(data) ? data.map((t) => t.name) : [];
        setAvailableTagNames(names);
        setTagOptions(names.map((name) => ({ value: name, label: name })));
      } catch (e) {
        // ignore
      }
    };
    fetchTags();
    return () => (mounted = false);
  }, []);

  const filteredEvents = events
    .filter((ev) => {
      const evDate = ev.date ? new Date(ev.date) : null;

      // If tags are selected, event must have at least one matching tag
      if (selectedTags.length > 0) {
        const tagNames = (ev.tags || []).map((t) => (typeof t === "object" ? t.name : t));
        const hasMatchingTag = selectedTags.some((selectedTag) => tagNames.includes(selectedTag.value));
        if (!hasMatchingTag) return false;
      }

      // If excluded tags are selected, event must not have any excluded tags
      if (excludedTags.length > 0) {
        const tagNames = (ev.tags || []).map((t) => (typeof t === "object" ? t.name : t));
        const hasExcludedTag = excludedTags.some((excludedTag) => tagNames.includes(excludedTag.value));
        if (hasExcludedTag) return false;
      }

      if (startDate && evDate) {
        const start = new Date(startDate);
        if (evDate < start) return false;
      }

      if (endDate && evDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (evDate > end) return false;
      }

      if (locationTerm.trim()) {
        const loc = (ev.location || "").toLowerCase();
        if (!loc.includes(locationTerm.toLowerCase())) return false;
      }

      if (!searchTerm.trim()) return true;

      const s = searchTerm.toLowerCase();
      const tagStrings = (ev.tags || []).map((t) => (typeof t === "object" ? t.name : t));
      const text = [
        ev.name,
        ev.description,
        ev.location,
        ...tagStrings,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(s);
    })
    .slice()
    .sort((a, b) => {
      const da = a.date ? new Date(a.date) : null;
      const db = b.date ? new Date(b.date) : null;
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setExcludedTags([]);
    setStartDate("");
    setEndDate("");
    setLocationTerm("");
  };

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
      {/* ✅ THIS IS THE ONLY NEW LINE */}
      <SiteHeader />

      <Box minH="100vh" bg="#1f49b6" color="white" pt={6} pb={20}>
        <Container maxW="6xl" px={4}>
          <BackArrow />

          <Heading textAlign="center" fontSize="48px" fontWeight="700" mb={2}>
            Browse Events
          </Heading>

          <Text textAlign="center" mb={6} opacity={0.9}>
            Search by name, tags, location, or date range to find opportunities.
          </Text>

          <VStack spacing={4} mb={6} align="stretch">
            <Input
              placeholder="Search by name, description, location, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              color="black"
            />

            <Box>
              <Select
                options={tagOptions}
                isMulti
                isSearchable
                placeholder="Filter by tags (select or search)..."
                value={selectedTags}
                onChange={(selected) => setSelectedTags(Array.isArray(selected) ? selected : [])}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                    backgroundColor: "white",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#1f49b6" : state.isFocused ? "#e6f0ff" : "white",
                    color: state.isSelected ? "white" : "#1f49b6",
                    cursor: "pointer",
                  }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    borderColor: "#b7c9e6",
                  }),
                }}
              />
            </Box>

            <Box>
              <Select
                options={tagOptions}
                isMulti
                isSearchable
                placeholder="Exclude tags (select or search)..."
                value={excludedTags}
                onChange={(selected) => setExcludedTags(Array.isArray(selected) ? selected : [])}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                    backgroundColor: "white",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#1f49b6" : state.isFocused ? "#e6f0ff" : "white",
                    color: state.isSelected ? "white" : "#1f49b6",
                    cursor: "pointer",
                  }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    borderColor: "#b7c9e6",
                  }),
                }}
              />
            </Box>

            <Flex gap={3} flexWrap="wrap" align={{ base: "stretch", md: "center" }}>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                bg="white"
                color="black"
                maxW={{ base: "100%", md: "200px" }}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                bg="white"
                color="black"
                maxW={{ base: "100%", md: "200px" }}
              />
              <Input
                placeholder="Filter by location..."
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                bg="white"
                color="black"
                maxW={{ base: "100%", md: "260px" }}
              />
              <Button onClick={clearFilters} variant="outline" colorScheme="whiteAlpha">
                Clear filters
              </Button>
            </Flex>
          </VStack>

          {apiError && (
            <Text textAlign="center" color="red.300" mb={4}>
              {apiError}
            </Text>
          )}

          {!apiError && (
            <Text textAlign="center" mb={4} fontSize="sm" opacity={0.8}>
              Showing {filteredEvents.length} event
              {filteredEvents.length === 1 ? "" : "s"}
            </Text>
          )}

          {filteredEvents.length === 0 && !apiError && (
            <Text textAlign="center" fontSize="20px">
              No events match your search or filters.
            </Text>
          )}

          <VStack spacing={6} align="stretch">
            {filteredEvents.map((event) => {
              const dateObj = event.date ? new Date(event.date) : null;
              const dateStr = dateObj?.toLocaleDateString() || "No date";
              const timeStr = dateObj?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <Card
                  key={event._id}
                  borderColor="#d9d9d9"
                  borderWidth="1px"
                  bg="white"
                  color="black"
                  cursor="pointer"
                  _hover={{ boxShadow: "lg", transform: "scale(1.01)" }}
                  transition="0.15s ease"
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <CardBody p={6}>
                    <HStack align="flex-start" spacing={6}>
                      <Image
                        src={
                          event.imageUrl ||
                          "https://via.placeholder.com/171x159?text=Event"
                        }
                        alt={event.name}
                        w="171px"
                        h="159px"
                        objectFit="cover"
                        borderRadius="md"
                      />

                      <VStack align="stretch" spacing={2}>
                        <Heading as="h2" size="md">
                          {event.name}
                        </Heading>

                        <Text opacity={0.7}>
                          {timeStr && `${timeStr} — `}
                          {dateStr}
                        </Text>

                        {event.location && (
                          <Text fontSize="sm" opacity={0.8}>
                            Location: {event.location}
                          </Text>
                        )}

                        {event.tags?.length > 0 && (
                          <HStack spacing={2} flexWrap="wrap">
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
                  </CardBody>
                </Card>
              );
            })}
          </VStack>
        </Container>
      </Box>
    </>
  );
}
