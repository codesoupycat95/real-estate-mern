import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully..." });
    }
    catch (error) {
        // res.status(500).json(error.message);
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found!"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
        const { password: pass, ...rest } = validUser._doc;   // Filter to separate password and rest of the information (in short we are trying to not select password)

        // Creating the cookie. If you want to put an expiry date and time, add the key `expires:<time>` after httpOnly 
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
}