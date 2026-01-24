// routes/userRoute.js
import express from "express";

import {
  create,
  getUserById,
  getAllUsers,
  update,
  deleteUser,
  deleteUserById,
  logout,
  login,
  passwordResetRequest,
  passwordReset,
} from "../controller/userController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/user", create);
route.get("/user", requireAuth, getUserById);
route.get("/users",requireAuth, requireAdmin, getAllUsers);
route.put("/user", requireAuth, update);
// route to delete the current authenticated user
//route.delete("/user", requireAuth, deleteUser);

// Admin/dev route: delete a user by id
route.delete("/users/:id", requireAuth, requireAdmin, deleteUserById);

// ⬇️ NEW login endpoint
route.post("/login", login);
route.post("/logout", requireAuth, logout);


// ⬇️ Password reset endpoints
route.post("/password-reset-request", passwordResetRequest);
route.post("/password-reset", passwordReset);

export default route;