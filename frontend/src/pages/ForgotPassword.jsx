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
import BackArrow from "../assets/backArrow";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/password-reset-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
            `Request failed with status ${res.status}`
        );
      } else {
        setMessage(
          data?.message ||
            "If an account with that email exists, a password reset link has been sent."
        );
        setEmail("");
        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      setError(err.message || "Network error during password reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#1f49b6"
      boxSizing="border-box"
    >
      <Box maxW="480px" w="full" mx="auto" px={4} position="relative">
        <BackArrow />

        <Box p={6} maxW="480px" mx="auto" mt={8}>
          <Heading as="h2" size="lg" mb={6} textAlign="center" color="white">
            Reset Your Password
          </Heading>

          <Box p={6} maxW="480px" mx="auto" bg="white" borderRadius="lg">
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
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  bg="white"
                />
              </FormControl>

              <Text fontSize="sm" color="gray.600">
                Enter your email address and we'll send you a link to reset your
                password.
              </Text>

              <Button
                type="submit"
                isLoading={loading}
                w="full"
                colorScheme="blue"
              >
                Send Reset Link
              </Button>

              <Box textAlign="center" w="full" mt={4}>
                <Link color="blue.500" onClick={() => navigate("/login")}>
                  Back to Login
                </Link>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
