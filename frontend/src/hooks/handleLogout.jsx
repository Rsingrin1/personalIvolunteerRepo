import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function useLogout() {
    const navigate = useNavigate();

    return async function logout() {
      await axios.post(`${API_BASE}/api/logout`, {}, { withCredentials: true });
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("organizerId");
      navigate("/");
    };
  };
