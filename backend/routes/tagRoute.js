import express from "express";
import {
getAllTags,
createTag,
deleteTag,
} from "../controller/tagController.js";

const route = express.Router();

// GET /api/tags - return all tags
route.get("/tags", getAllTags);

// POST /api/tags - create a tag
route.post("/tags", createTag);

// DELETE /api/tags/:id - delete a tag
route.delete("/tags/:id", deleteTag);

export default route;
