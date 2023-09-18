import express from "express";

import { getPost, createPost } from "../controllers/posts.js";

const router = express.Router();

router.get("/", createPost);

// module.exports = router;
export default router;
