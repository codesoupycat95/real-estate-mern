import express from "express";
import { signup } from "../controllers/auth.controller.js";  //only works in object format

const router = express.Router();

router.post("/signup", signup);

export default router;