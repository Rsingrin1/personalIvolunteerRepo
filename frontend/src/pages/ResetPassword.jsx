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
import { useNavigate, useSearchParams } from "react-router-dom";
import BackArrow from "../assets/backArrow";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
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
        setMessage(data?.message || "Password reset successfully!");
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.message || "Network error during password reset.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
        <Box maxW="480px" w="full" mx="auto" px={4}>
          <Box p={6} bg="white" borderRadius="lg">
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              <Text>Invalid or missing reset token.</Text>
            </Alert>
            <Text mb={4}>
              Please request a new password reset from the login page.
            </Text>
            <Link color="blue.500" onClick={() => navigate("/forgot-password")}>
              Request New Reset Link
            </Link>
          </Box>
        </Box>
      </Box>
    );
  }

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
                <FormLabel htmlFor="newPassword">New Password</FormLabel>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  bg="white"
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  bg="white"
                />
              </FormControl>

              <Text fontSize="sm" color="gray.600">
                Password must be at least 6 characters long.
              </Text>

              <Button
                type="submit"
                isLoading={loading}
                w="full"
                colorScheme="blue"
              >
                Reset Password
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
