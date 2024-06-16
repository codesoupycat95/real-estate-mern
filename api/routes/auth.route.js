import express from "express";
import { signUp, signIn, google, signOut } from "../controllers/auth.controller.js";  //only works in object format

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", google);
router.get("/signout", signOut);

export default router;