import { useEffect, useState } from "react";
import axios from "axios";

export default function useUser(id) {
  const initialState = {
    username: "",
    email: "",
    _id: "",
    notifSetting: false,
    bio: "",
    phone: "",
    name: {
      fname: "",
      lname: "",
    },
  };

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // fetch user from token (stored in httpOnly cookie)
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/user`, {
          withCredentials: true, // Send cookies with request
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err.response?.status, err.message);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Run once on mount

  // update user
  const updateUser = async () => {
    return axios.put(
      `http://localhost:5000/api/user`,
      user,
      {
        withCredentials: true, // Send cookies with request
      }
    );
  };

  return {
    user,
    setUser,
    inputHandler,
    updateUser,
    loading,
    error,
  };
}
