// BackArrow.jsx
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";   // ⬅️ use this instead
import { useNavigate } from "react-router-dom";

export default function BackArrow({
  size = "40px",
  color = "white",
  top = 4,
  left = 4,
}) {
  const navigate = useNavigate();

  return (
    <IconButton
      position="absolute"
      top={top}
      left={left}
      aria-label="Go back"
      icon={
        <ArrowBackIcon
          boxSize={size}   // keeps your big, thick arrow
          color={color}
        />
      }
      onClick={() => navigate(-1)}
      variant="ghost"
      borderRadius="full"
      boxShadow="md"
      _hover={{
        bg: "whiteAlpha.200",
        transform: "scale(1.2)",
      }}
      p={4}
    />
  );
}
