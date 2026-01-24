import React from "react";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import useLogout from "../hooks/handleLogout";
import { useNavigate } from "react-router-dom";

export default function Profile({ userName, profilePic}) {
const handleLogout = useLogout(); //this is using react router to navigate
const navigate = useNavigate();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={
          <Avatar
            name={userName}
            src={profilePic}
            size="sm"
            cursor="pointer"
          />
        }
        variant="ghost"
        _hover={{ bg: "transparent" }}
      />
      <MenuList>
        <MenuItem onClick={() => navigate("/Profile")}>My Profile</MenuItem>
        <MenuItem onClick={() => console.log("Go to Home")}>Home</MenuItem>
        <MenuItem onClick={handleLogout || (() => console.log("Logout"))}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}


