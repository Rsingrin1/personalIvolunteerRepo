import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function InputUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        credentials: "include", // 🔥 cookie-only auth: accept HTTP-only token
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      let data = null;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        setError(
          (data && (data.message || data.errorMessage)) ||
            `Login failed with status ${res.status}`
        );
        return;
      }

      // Expected response: { message, user: { id, username, email, userType } }
      if (!data || !data.user) {
        setError("Unexpected login response from server.");
        return;
      }

      const user = data.user;

      // 🔥 Cookie holds the token; we only keep user info in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // For organizer-only pages that need organizerId
      if (user.userType === "organizer") {
        localStorage.setItem("organizerId", user.id);
      } else {
        localStorage.removeItem("organizerId");
      }

      setMessage(data.message || "Login successful.");

      // Redirect after login
      navigate("/Profile");
    } catch (err) {
      setError(err.message || "Network error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6} maxW="720px" mx="auto">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        {/* Optional subtitle */}
      </Heading>
      <Box p={6} maxW="480px" mx="auto">
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          Login
        </Heading>

        {message && (
          <Alert status="success" mb={4} borderRadius="md">
            <AlertIcon />
            <Text>{message}</Text>
          </Alert>
        )}

        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        )}

        <VStack as="form" spacing={4} onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              bg="white"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              bg="white"
            />
          </FormControl>

          <Button
            type="submit"
            isLoading={loading}
            w="full"
            colorScheme="blue"
          >
            Submit
          </Button>

          <Box textAlign="center" w="full">
            <Link color="blue.500" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Link>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
