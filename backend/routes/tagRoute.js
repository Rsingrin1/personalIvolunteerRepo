import express from "express";
import {
getAllTags,
createTag,
deleteTag,
} from "../controller/tagController.js";


import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
const route = express.Router();

// GET /api/tags - return all tags
route.get("/tags", getAllTags);

// POST /api/tags - create a tag
route.post("/tags", requireAuth, requireAdmin, createTag);

// DELETE /api/tags/:id - delete a tag
route.delete("/tags/:id", requireAuth, requireAdmin, deleteTag);

export default route;
