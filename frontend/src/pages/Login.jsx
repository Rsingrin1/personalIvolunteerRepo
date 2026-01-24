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
import axios from "axios";

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

      const res = await axios.post(`${API_BASE}/api/login`, 
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const data = res.data;

      // Expected response: { message, user: { id, username, email, userType } }
      if (!data || !data.user) {
        setError("Unexpected login response from server.");
        return;
      }

      const user = data.user;

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
